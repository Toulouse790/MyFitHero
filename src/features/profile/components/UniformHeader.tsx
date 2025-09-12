import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Settings, 
  Bell, 
  User, 
  Menu,
  Search,
  Sun,
  Moon,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { appStore, useAppStoreUser, useAppStoreNotifications, useAppStoreUI } from '@/store/appStore';

export interface UniformHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showSettings?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  gradient?: boolean;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  onBack?: () => void;
  onSettings?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  onSearch?: () => void;
  onMenu?: () => void;
  rightAction?: React.ReactNode;
  leftAction?: React.ReactNode;
}

const UniformHeader: React.FC<UniformHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  showSettings = true,
  showNotifications = true,
  showProfile = true,
  showSearch = false,
  showMenu = false,
  gradient = true,
  backgroundColor,
  textColor = 'text-white',
  className = '',
  onBack,
  onSettings,
  onNotifications,
  onProfile,
  onSearch,
  onMenu,
  rightAction,
  leftAction,
}) => {
  const navigate = useNavigate();
  const user = useAppStoreUser();
  const { notifications, unreadCount } = useAppStoreNotifications();
  const { theme } = useAppStoreUI();
  const { setTheme, toggleSidebar } = appStore();

  // Default handlers
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleSettings = () => {
    if (onSettings) {
      onSettings();
    } else {
      navigate('/settings');
    }
  };

  const handleNotifications = () => {
    if (onNotifications) {
      onNotifications();
    } else {
      navigate('/notifications');
    }
  };

  const handleProfile = () => {
    if (onProfile) {
      onProfile();
    } else {
      navigate('/profile');
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    } else {
      navigate('/search');
    }
  };

  const handleMenu = () => {
    if (onMenu) {
      onMenu();
    } else {
      toggleSidebar();
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Generate gradient classes
  const getGradientClass = () => {
    if (!gradient) return backgroundColor || 'bg-blue-600';
    
    return 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600';
  };

  return (
    <header 
      className={`
        ${getGradientClass()}
        ${textColor}
        px-4 py-3 
        flex items-center justify-between
        shadow-lg
        relative
        z-10
        ${className}
      `}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        {leftAction || (
          <>
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className={`${textColor} hover:bg-white/10 p-2`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            
            {showMenu && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMenu}
                className={`${textColor} hover:bg-white/10 p-2`}
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
          </>
        )}
        
        {/* Title and Subtitle */}
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm opacity-90 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {rightAction || (
          <>
            {/* Search */}
            {showSearch && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearch}
                className={`${textColor} hover:bg-white/10 p-2`}
              >
                <Search className="w-5 h-5" />
              </Button>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={`${textColor} hover:bg-white/10 p-2`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Notifications */}
            {showNotifications && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNotifications}
                  className={`${textColor} hover:bg-white/10 p-2 relative`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white border-0 flex items-center justify-center"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>
            )}

            {/* Settings */}
            {showSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSettings}
                className={`${textColor} hover:bg-white/10 p-2`}
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}

            {/* Profile */}
            {showProfile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfile}
                className={`${textColor} hover:bg-white/10 p-2`}
              >
                {user?.avatar_url ? (
                  <Avatar className="w-6 h-6">
                    <img 
                      src={user.avatar_url} 
                      alt={user.full_name || 'Profile'} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </Avatar>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Button>
            )}

            {/* More Options */}
            <Button
              variant="ghost"
              size="sm"
              className={`${textColor} hover:bg-white/10 p-2`}
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>

      {/* Gradient Overlay for additional depth */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      )}
    </header>
  );
};

// Predefined header variants for common use cases
export const DashboardHeader: React.FC<Omit<UniformHeaderProps, 'showMenu' | 'showSearch'>> = (props) => (
  <UniformHeader
    {...props}
    showMenu={true}
    showSearch={true}
    gradient={true}
  />
);

export const FeatureHeader: React.FC<Omit<UniformHeaderProps, 'showBackButton'>> = (props) => (
  <UniformHeader
    {...props}
    showBackButton={true}
    gradient={true}
  />
);

export const SimpleHeader: React.FC<Omit<UniformHeaderProps, 'showSettings' | 'showNotifications'>> = (props) => (
  <UniformHeader
    {...props}
    showSettings={false}
    showNotifications={false}
    gradient={false}
    backgroundColor="bg-white"
    textColor="text-gray-900"
  />
);

export const AuthHeader: React.FC<Omit<UniformHeaderProps, 'showProfile' | 'showNotifications' | 'showSettings'>> = (props) => (
  <UniformHeader
    {...props}
    showProfile={false}
    showNotifications={false}
    showSettings={false}
    gradient={true}
  />
);

export default UniformHeader;