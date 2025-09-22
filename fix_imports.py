#!/usr/bin/env python3
import os
import re
import sys

def fix_imports_in_file(file_path):
    """Fix relative imports in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Store original content
        original_content = content
        
        # Pattern to match imports with relative paths
        # Matches: import ... from '../...' or from '../../...'
        pattern = r'(import[^;]*?from\s+[\'"])(\.\./[^\'"]*?)([\'"])'
        
        def replace_import(match):
            prefix = match.group(1)  # import ... from '
            relative_path = match.group(2)  # ../path/to/file
            suffix = match.group(3)  # '
            
            # Convert relative path to absolute @/ path
            # Remove leading ../
            clean_path = relative_path
            
            # Count how many levels up (../)
            levels_up = 0
            while clean_path.startswith('../'):
                levels_up += 1
                clean_path = clean_path[3:]  # Remove '../'
            
            # Determine the absolute path based on file location
            # Get the relative path from src/
            rel_from_src = os.path.relpath(file_path, '/workspaces/MyFitHero/src')
            
            # Count how deep the current file is
            current_depth = len([p for p in rel_from_src.split('/') if p and p != '.'])
            
            # If going up more levels than we are deep, it goes to src root
            if levels_up >= current_depth:
                new_path = f"@/{clean_path}"
            else:
                # Build the path by going up the right number of levels
                parts = rel_from_src.split('/')[:-1]  # Remove filename
                # Go up by levels_up
                for _ in range(levels_up):
                    if parts:
                        parts.pop()
                
                if parts:
                    new_path = f"@/{'/'.join(parts)}/{clean_path}"
                else:
                    new_path = f"@/{clean_path}"
            
            return f"{prefix}{new_path}{suffix}"
        
        # Apply the replacements
        new_content = re.sub(pattern, replace_import, content)
        
        # Write back if changed
        if new_content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False
    
    return False

def find_files_with_relative_imports(src_dir):
    """Find all files that contain relative imports."""
    files_with_imports = []
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if re.search(r'from\s+[\'"]\.\./', content):
                            files_with_imports.append(file_path)
                except:
                    continue
    
    return files_with_imports

def main():
    src_dir = '/workspaces/MyFitHero/src'
    
    # Find all files with relative imports
    files_to_fix = find_files_with_relative_imports(src_dir)
    
    print(f"Found {len(files_to_fix)} files with relative imports to fix:")
    
    fixed_count = 0
    for file_path in files_to_fix:
        rel_path = os.path.relpath(file_path, '/workspaces/MyFitHero')
        if fix_imports_in_file(file_path):
            fixed_count += 1
            print(f"✅ Fixed: {rel_path}")
        else:
            print(f"⏭️  No changes: {rel_path}")
    
    print(f"\n🎉 Summary: Fixed {fixed_count} files out of {len(files_to_fix)} total")

if __name__ == "__main__":
    main()