import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Scale, UserCheck, AlertTriangle, ArrowLeft } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Conditions d'Utilisation
          </h1>
          <p className="text-gray-600 text-lg">
            Termes et conditions pour l'utilisation de MyFitHero
          </p>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Accord d'utilisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              En utilisant MyFitHero, vous acceptez d'être lié par ces conditions d'utilisation. 
              Veuillez les lire attentivement avant d'utiliser notre service.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                Acceptation des conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                En accédant et en utilisant ce service, vous acceptez d'être lié par les termes 
                et conditions de service. Si vous n'acceptez pas tous les termes et conditions 
                de cet accord, vous ne devez pas utiliser ce service.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" />
                Utilisation du service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Vous vous engagez à utiliser le service de manière responsable et conforme à toutes 
                les lois applicables. Toute utilisation abusive ou frauduleuse peut entraîner la 
                suspension de votre compte.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Limitation de responsabilité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                MyFitHero fournit ce service "en l'état" et ne peut être tenu responsable de tout 
                dommage direct ou indirect résultant de l'utilisation du service. Consultez toujours 
                un professionnel de santé avant de commencer un programme de fitness.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
