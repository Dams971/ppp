import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    // État pour la validation en temps réel
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        length_max: false,
        upperCase: false,
        lowerCase: false,
        numeric: false,
        specialChar: false,
        match: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'email' || name === 'username') return;

        if (name === 'password') {
            validatePassword(value);
        }

        const updatedMatch = name === 'confirmPassword'
            ? value === formData.password
            : value === formData.confirmPassword;

        setPasswordErrors((prevErrors) => ({
            ...prevErrors,
            match: updatedMatch,
        }));
    };

    const validatePassword = (password: string) => {
        const minLength = 8;
        const maxLength = 64
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumeric = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?`~]/.test(password);

        setPasswordErrors((prevErrors) => ({
            length: password.length < minLength,
            length_max: password.length > maxLength,
            upperCase: !hasUpperCase,
            lowerCase: !hasLowerCase,
            numeric: !hasNumeric,
            specialChar: !hasSpecialChar,
            match: prevErrors.match,
        }));
    };

    const checkPasswordErrors = () => {
        // Le splice me sert à retirer le match à la fin qui est en true car ça match bien
        const values = Object.values(passwordErrors);
        if (passwordErrors.match) values.splice(values.length - 1, 1);
        return values.some(error => error);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const { username, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas");
            return;
        }

        if (checkPasswordErrors()) {
            setErrorMessage("Veuillez corriger les erreurs de mot de passe avant de soumettre.");
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                username,
                email,
                password,
            });

            if (response.status === 201) {
                setSuccessMessage('Inscription réussie!');

                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });

                router.push('/dashboard');
            }
        } catch (error) {
            setErrorMessage("Erreur lors de l'inscription, veuillez réessayer.");
        }
    };

    return (
        <div>
            <h1>Créer un compte</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Pseudo</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        maxLength={64}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        maxLength={64}
                    />
                </div>
                <div>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        maxLength={65}
                    />
                    <ul>
                        {passwordErrors.length && <li>Le mot de passe doit comporter au moins 8 caractères.</li>}
                        {passwordErrors.length_max && <li>Le mot de passe doit comporter au maximum 64 caractères ou moins.</li>}
                        {passwordErrors.upperCase && <li>Le mot de passe doit contenir au moins une lettre majuscule.</li>}
                        {passwordErrors.lowerCase && <li>Le mot de passe doit contenir au moins une lettre minuscule.</li>}
                        {passwordErrors.numeric && <li>Le mot de passe doit contenir au moins un chiffre.</li>}
                        {passwordErrors.specialChar && <li>Le mot de passe doit contenir au moins un caractère spécial.</li>}
                    </ul>
                </div>
                <div>
                    <label>Confirmer le mot de passe</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        maxLength={65}
                    />
                    {passwordErrors.match === false && <p>Les mots de passe ne correspondent pas.</p>}
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <button type="submit">S'inscrire</button>
            </form>
        </div>
    );
};

export default RegisterPage;
