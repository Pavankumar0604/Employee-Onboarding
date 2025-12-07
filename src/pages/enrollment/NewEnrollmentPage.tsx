import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';

const NewEnrollmentPage = () => {
  const navigate = useNavigate();

  const handleStartApplication = () => {
    navigate('/onboarding');
  };

  return (
    <div className="new-enrollment-page">
      <div className="new-enrollment-container">
        <div className="icon-container">
          <span className="edit-icon">
            <Edit className="h-12 w-12" />
          </span>
        </div>
        <h1>Welcome to Employee Onboarding</h1>
        <p>We need to collect some information to get you set up. This should only take a few minutes.</p>
        <button className="bg-sky-400 text-white font-semibold py-3 px-6 rounded-full hover:bg-sky-500 transition-colors" onClick={handleStartApplication}>Start New Application</button>
      </div>
    </div>
  );
};

export default NewEnrollmentPage;