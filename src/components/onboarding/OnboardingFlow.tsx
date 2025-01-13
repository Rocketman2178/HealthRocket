import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../../contexts/SupabaseContext';
import { OnboardingService } from '../../lib/onboarding/OnboardingService';
import { MissionIntro } from './steps/MissionIntro';
import { HealthIntro } from './steps/HealthIntro';
import { GameBasicsStep, HealthCategoriesStep, LaunchStep } from './steps/GuidanceSteps';
import { CommunitySelect } from './steps/CommunitySelect';
import { HealthUpdate } from './steps/HealthUpdate';
import { Logo } from '../ui/logo';

type OnboardingStep = 'mission' | 'community' | 'health-intro' | 'health-assessment' | 'game-basics' | 'health-categories' | 'launch';

export function OnboardingFlow() {
  const [step, setStep] = React.useState<OnboardingStep>('mission');
  const { user, signOut } = useSupabase();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = React.useState(false); 

  const handleLaunch = async () => {
    if (!user || isNavigating) return;
    setIsNavigating(true);
    
    
    try {
      await OnboardingService.completeOnboarding(user.id);
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setIsNavigating(false);
      // Reset loading state on error
      // Show error state if needed
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'mission':
        return <MissionIntro onAccept={() => setStep('community')} />;
      case 'community':
        return <CommunitySelect onContinue={() => setStep('health-intro')} />;
      case 'health-intro':
        return <HealthIntro onContinue={() => setStep('health-assessment')} />;
      case 'health-assessment':
        return <HealthUpdate onComplete={() => setStep('game-basics')} />;
      case 'game-basics':
        return <GameBasicsStep onContinue={() => setStep('health-categories')} />;
      case 'health-categories':
        return <HealthCategoriesStep onContinue={() => setStep('launch')} />;
      case 'launch':
        return <LaunchStep onContinue={handleLaunch} isLoading={isNavigating} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&q=80")',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative z-10 w-full max-w-[480px] pt-12 mb-8">
        <Logo />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="relative z-10 mt-0">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}