import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { Separator } from '../../../../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Switch } from '../../../../components/ui/switch';
import { Textarea } from '../../../../components/ui/textarea';
import { Settings, User, Activity, Bell, Shield, Trash2 } from 'lucide-react';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  bio: z.string().max(500, 'La bio ne peut pas dépasser 500 caractères').optional(),
  sport: z.string().min(1, 'Sélectionnez votre sport principal'),
  level: z.string().min(1, 'Sélectionnez votre niveau'),
  age: z.number().min(16, 'Vous devez avoir au moins 16 ans').max(100, 'Âge invalide'),
  weight: z.number().min(30, 'Poids minimum: 30kg').max(300, 'Poids maximum: 300kg'),
  height: z.number().min(100, 'Taille minimum: 100cm').max(250, 'Taille maximum: 250cm'),
  gender: z.enum(['male', 'female', 'other']),
  goals: z.array(z.string()),
  lifestyle: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfileProps {
  user?: {
    id: string;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    sport?: string;
    level?: string;
    goals?: string[];
    age?: number;
    weight?: number;
    height?: number;
    gender?: 'male' | 'female' | 'other';
    lifestyle?: string;
    onboardingCompleted?: boolean;
    createdAt: string;
    updatedAt: string;
  };
  onUpdateProfile?: (data: ProfileFormData) => Promise<void>;
  onSignOut?: () => Promise<void>;
  isLoading?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user,
  onUpdateProfile = async () => {},
  onSignOut = async () => {},
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    nutritionTips: true,
    socialUpdates: false,
    systemUpdates: true,
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || '',
      email: user?.email || '',
      bio: '',
      goals: user?.goals || [],
      sport: user?.sport || '',
      level: user?.level || '',
      lifestyle: user?.lifestyle || '',
      age: user?.age,
      weight: user?.weight,
      height: user?.height,
      gender: user?.gender,
    },
  });

  const watchedGoals = watch('goals', []);

  const handleGoalToggle = (goal: string) => {
    const currentGoals = watchedGoals;
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    setValue('goals', newGoals);
  };

  const onSubmit = async (data: ProfileFormData) => {
    await onUpdateProfile(data);
  };

  const getInitials = (user?: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return 'MF';
  };

  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height) return null;
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Insuffisance pondérale', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Poids normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Surpoids', color: 'text-yellow-600' };
    return { label: 'Obésité', color: 'text-red-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Profile */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar_url} alt={user?.firstName || user?.username} />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || 'Utilisateur'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">
                    Membre depuis {new Date(user?.createdAt || '').toLocaleDateString()}
                  </Badge>
                  {user?.onboardingCompleted && (
                    <Badge variant="default">Profil complet</Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={onSignOut}>
                Déconnexion
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger value="fitness" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Fitness</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations de profil et préférences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">Nom d'affichage</Label>
                      <Input
                        id="displayName"
                        {...register('displayName')}
                        placeholder="Votre nom"
                      />
                      {errors.displayName && (
                        <p className="text-sm text-red-500">{errors.displayName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      {...register('bio')}
                      placeholder="Parlez-nous de vous..."
                      rows={3}
                    />
                    {errors.bio && (
                      <p className="text-sm text-red-500">{errors.bio.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fitness" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Données physiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Âge</Label>
                      <Input
                        id="age"
                        type="number"
                        {...register('age', { valueAsNumber: true })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Genre</Label>
                      <Select onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Homme</SelectItem>
                          <SelectItem value="female">Femme</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Poids (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        {...register('weight', { valueAsNumber: true })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Taille (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        {...register('height', { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  {watch('weight') && watch('height') && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm font-medium mb-1">IMC calculé</div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">
                          {calculateBMI(watch('weight'), watch('height'))}
                        </span>
                        <span className={`text-sm font-medium ${getBMICategory(parseFloat(calculateBMI(watch('weight'), watch('height')) || '0')).color}`}>
                          {getBMICategory(parseFloat(calculateBMI(watch('weight'), watch('height')) || '0')).label}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Préférences sportives</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Sport principal</Label>
                    <Select onValueChange={(value) => setValue('sport', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strength">Musculation</SelectItem>
                        <SelectItem value="running">Course à pied</SelectItem>
                        <SelectItem value="cycling">Cyclisme</SelectItem>
                        <SelectItem value="swimming">Natation</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Niveau</Label>
                    <Select onValueChange={(value) => setValue('level', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Débutant</SelectItem>
                        <SelectItem value="intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Style de vie</Label>
                    <Select onValueChange={(value) => setValue('lifestyle', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sédentaire</SelectItem>
                        <SelectItem value="lightly_active">Légèrement actif</SelectItem>
                        <SelectItem value="moderately_active">Modérément actif</SelectItem>
                        <SelectItem value="very_active">Très actif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Objectifs fitness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'lose_weight', label: 'Perdre du poids', emoji: '⚖️' },
                    { id: 'gain_muscle', label: 'Prendre du muscle', emoji: '💪' },
                    { id: 'improve_endurance', label: 'Améliorer l\'endurance', emoji: '🏃' },
                    { id: 'increase_strength', label: 'Augmenter la force', emoji: '🏋️' },
                    { id: 'better_health', label: 'Améliorer la santé', emoji: '❤️' },
                    { id: 'reduce_stress', label: 'Réduire le stress', emoji: '🧘' },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        watchedGoals.includes(goal.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{goal.emoji}</div>
                      <div className="text-xs font-medium">{goal.label}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>
                  Choisissez quelles notifications vous souhaitez recevoir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    key: 'workoutReminders',
                    title: 'Rappels d\'entraînement',
                    description: 'Notifications pour vos séances programmées'
                  },
                  {
                    key: 'nutritionTips',
                    title: 'Conseils nutritionnels',
                    description: 'Conseils et rappels pour votre alimentation'
                  },
                  {
                    key: 'socialUpdates',
                    title: 'Activités sociales',
                    description: 'Activités de vos amis et communauté'
                  },
                  {
                    key: 'systemUpdates',
                    title: 'Mises à jour système',
                    description: 'Nouvelles fonctionnalités et améliorations'
                  }
                ].map((notification) => (
                  <div key={notification.key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">{notification.title}</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.description}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[notification.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({
                          ...prev,
                          [notification.key]: checked
                        }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Sécurité et confidentialité</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Changer le mot de passe
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Gérer les données personnelles
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Télécharger mes données
                </Button>
                <Separator />
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                      // Handle account deletion
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer le compte
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
