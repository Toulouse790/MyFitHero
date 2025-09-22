import React, { useState, useEffect } from 'react';
import { appStore } from '@/store/appStore';
import { useToast } from '@/shared/hooks/use-toast';
import AvatarUpload from '../components/AvatarUpload';
import UserProfileTabs from '../components/UserProfileTabs';
import UserProfileHeader from '../components/profile/UserProfileHeader';
import PhysicalDataForm from '../components/profile/PhysicalDataForm';
import ConnectedScales from '../components/profile/ConnectedScales';
import WeightHistory from '../components/profile/WeightHistory';
import { useProfileStats } from '../components/profile/ProfileStats';

const ProfilePage: React.FC = () => {
  const { toast } = useToast();
  const { appStoreUser, updateUserProfile } = appStore();
  
  const [currentWeight, setCurrentWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [fitnessGoal, setFitnessGoal] = useState('maintain');
  const [showWeightHistory, setShowWeightHistory] = useState(false);

  const profileStats = useProfileStats(currentWeight, height, []);

  useEffect(() => {
    if (appStoreUser) {
      setCurrentWeight(appStoreUser.weight?.toString() || '70');
      setHeight(appStoreUser.height?.toString() || '175');
      setAge(appStoreUser.age?.toString() || '25');
      setGender(appStoreUser.gender || '');
    }
  }, [appStoreUser]);

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        weight: parseFloat(currentWeight),
        height: parseFloat(height),
        age: parseInt(age),
        gender: gender as 'male' | 'female' | 'other',
        activity_level: activityLevel as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active',
      });
      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été sauvegardées avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les modifications.',
        variant: 'destructive',
      });
    }
  };

  if (!appStoreUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">
            Chargement du profil...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <UserProfileHeader
          userProfile={appStoreUser}
          user={appStoreUser}
          stats={profileStats}
          bmi={profileStats.bmi}
          weightTrend={profileStats.weightTrend as { type: 'up' | 'down' | 'stable'; diff: number; } | null}
          latestWeight={profileStats.latestWeight}
        />

        <PhysicalDataForm
          currentWeight={currentWeight}
          onWeightChange={setCurrentWeight}
          height={height}
          onHeightChange={setHeight}
          age={age}
          onAgeChange={setAge}
          gender={gender}
          onGenderChange={setGender}
          activityLevel={activityLevel}
          onActivityLevelChange={setActivityLevel}
          fitnessGoal={fitnessGoal}
          onFitnessGoalChange={setFitnessGoal}
          isLoading={false}
          onSave={handleSaveProfile}
        />

        <ConnectedScales 
          connectedScales={[]}
          isScanning={false}
          isSyncing={false}
          onSyncScale={() => {}}
          onScanForScales={() => {}}
        />

        <WeightHistory
          weightHistory={[]}
          showWeightHistory={showWeightHistory}
          onToggleHistory={() => setShowWeightHistory(!showWeightHistory)}
        />

        <UserProfileTabs />
      </div>
    </div>
  );
};

export default ProfilePage;
