import React from 'react';
import Skeleton from '../Shared/Skeleton';

interface AuthFormSkeletonProps {
  variant?: 'login' | 'register';
  className?: string;
}

const AuthFormSkeleton: React.FC<AuthFormSkeletonProps> = ({
  variant = 'login',
  className = ''
}) => {
  return (
    <div className={`auth-form-skeleton ${className}`}>
      <div className="skeleton max-w-md mx-auto p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <Skeleton variant="title" width="200px" className="mx-auto mb-2" />
          <Skeleton variant="subtitle" width="150px" className="mx-auto" />
        </div>
        
        {/* Form fields */}
        <div className="space-y-4">
          {/* Email field */}
          <div>
            <Skeleton variant="subtitle" width="60px" className="mb-2" />
            <Skeleton width="100%" height="48px" borderRadius="8px" />
          </div>
          
          {variant === 'register' && (
            <>
              {/* Full name field */}
              <div>
                <Skeleton variant="subtitle" width="80px" className="mb-2" />
                <Skeleton width="100%" height="48px" borderRadius="8px" />
              </div>
              
              {/* Phone field */}
              <div>
                <Skeleton variant="subtitle" width="90px" className="mb-2" />
                <Skeleton width="100%" height="48px" borderRadius="8px" />
              </div>
            </>
          )}
          
          {/* Password field */}
          <div>
            <Skeleton variant="subtitle" width="70px" className="mb-2" />
            <Skeleton width="100%" height="48px" borderRadius="8px" />
          </div>
          
          {variant === 'register' && (
            /* Confirm password field */
            <div>
              <Skeleton variant="subtitle" width="120px" className="mb-2" />
              <Skeleton width="100%" height="48px" borderRadius="8px" />
            </div>
          )}
          
          {variant === 'login' && (
            /* Remember me and forgot password */
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton width="16px" height="16px" />
                <Skeleton width="90px" height="16px" />
              </div>
              <Skeleton width="120px" height="16px" />
            </div>
          )}
          
          {/* Submit button */}
          <Skeleton variant="btn" width="100%" height="48px" className="mt-6" />
          
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Skeleton width="100%" height="1px" />
            </div>
            <div className="relative flex justify-center">
              <Skeleton width="40px" height="16px" />
            </div>
          </div>
          
          {/* Social login buttons */}
          <div className="space-y-3">
            <Skeleton variant="btn" width="100%" height="48px" />
            <Skeleton variant="btn" width="100%" height="48px" />
          </div>
          
          {/* Footer link */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-2">
              <Skeleton width="150px" height="16px" />
              <Skeleton width="60px" height="16px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthFormSkeleton;
