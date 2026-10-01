import React from 'react';
import {
  Activity as ActivityLucide,
  Bike,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  Mountain,
  Waves,
} from 'lucide-react';
import { ActivityType } from '../../types/fitness';

interface ActivityIconProps {
  type: ActivityType;
  className?: string;
}

export const ActivityIcon: React.FC<ActivityIconProps> = ({ type, className = 'w-5 h-5' }) => {
  switch (type) {
    case 'Running':
      return <Footprints className={className} />;
    case 'Walking':
      return <Footprints className={className} />;
    case 'Cycling':
      return <Bike className={className} />;
    case 'Gym':
      return <Dumbbell className={className} />;
    case 'Yoga':
      return <HeartPulse className={className} />;
    case 'Swimming':
      return <Waves className={className} />;
    case 'Hiking':
      return <Mountain className={className} />;
    case 'HIIT':
      return <Flame className={className} />;
    case 'Other':
    default:
      return <ActivityLucide className={className} />;
  }
};
