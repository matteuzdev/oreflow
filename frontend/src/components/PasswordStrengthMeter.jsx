import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PasswordStrengthMeter = ({ password }) => {
  const checkPasswordStrength = (password) => {
    const validations = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[\W_]/.test(password), // \W é qualquer caractere que não seja letra, número ou _
    };

    const score = Object.values(validations).filter(Boolean).length;
    let strengthText = '';
    let strengthColor = 'bg-gray-300';

    switch (score) {
      case 1:
      case 2:
        strengthText = 'Fraca';
        strengthColor = 'bg-red-500';
        break;
      case 3:
      case 4:
        strengthText = 'Média';
        strengthColor = 'bg-yellow-500';
        break;
      case 5:
        strengthText = 'Forte';
        strengthColor = 'bg-green-500';
        break;
      default:
        strengthText = 'Inválida';
        strengthColor = 'bg-gray-300';
    }

    return { score, strengthText, strengthColor, validations };
  };

  const { score, strengthText, strengthColor, validations } = checkPasswordStrength(password);

  const validationCriteria = [
    { text: 'Pelo menos 8 caracteres', valid: validations.minLength },
    { text: 'Uma letra maiúscula', valid: validations.hasUpperCase },
    { text: 'Uma letra minúscula', valid: validations.hasLowerCase },
    { text: 'Um número', valid: validations.hasNumber },
    { text: 'Um símbolo', valid: validations.hasSymbol },
  ];

  // Não mostra o medidor se a senha estiver vazia
  if (!password) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${strengthColor}`}
          style={{ width: `${(score / 5) * 100}%` }}
        ></div>
      </div>
      <p className="text-sm font-medium text-gray-700">
        Força da senha: <span className={`font-bold ${strengthColor.replace('bg-', 'text-')}`}>{strengthText}</span>
      </p>
      <ul className="space-y-1">
        {validationCriteria.map((criterion, index) => (
          <li key={index} className={`flex items-center text-xs ${criterion.valid ? 'text-green-600' : 'text-gray-500'}`}>
            {criterion.valid ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
            {criterion.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
