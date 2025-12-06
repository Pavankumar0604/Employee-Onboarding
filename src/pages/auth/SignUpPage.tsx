import React from 'react';
import SignUpForm from '../../components/auth/SignUpForm';
import { AuthView } from '../../types/auth';

interface SignUpPageProps {
  onNavigate: (page: AuthView) => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  return <SignUpForm onNavigate={onNavigate} />;
};

export default SignUpPage;