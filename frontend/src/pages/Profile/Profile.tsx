import { useState, useEffect } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/api/apiSlice';
import { useAppDispatch } from '../../hooks/useRedux';
import { setUser } from '../../store/slices/authSlice';
import AccountCard from '../../components/AccountCard/AccountCard';
import './Profile.css';

const accounts = [
    {
        title: 'Argent Bank Checking (x8349)',
        amount: '$2,082.79',
        description: 'Available Balance',
    },
    {
        title: 'Argent Bank Savings (x6712)',
        amount: '$10,928.42',
        description: 'Available Balance',
    },
    {
        title: 'Argent Bank Credit Card (x8349)',
        amount: '$184.30',
        description: 'Current Balance',
    },
];

const Profile = () => {
    const dispatch = useAppDispatch();
    const { data: profileData, isLoading, refetch } = useGetProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        if (profileData?.body) {
            dispatch(setUser(profileData.body));
            setFirstName(profileData.body.firstName);
            setLastName(profileData.body.lastName);
        }
    }, [profileData, dispatch]);

    const handleSave = async () => {
        try {
            await updateProfile({ firstName, lastName }).unwrap();
            setIsEditing(false);
            refetch();
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleCancel = () => {
        if (profileData?.body) {
            setFirstName(profileData.body.firstName);
            setLastName(profileData.body.lastName);
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <main className="main bg-dark">
                <div className="header">
                    <h1>Loading...</h1>
                </div>
            </main>
        );
    }

    return (
        <main className="main bg-dark">
            <div className="header">
                {isEditing ? (
                    <>
                        <h1>Welcome back</h1>
                        <div className="edit-form">
                            <div className="edit-inputs">
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="First Name"
                                    className="edit-input"
                                />
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Last Name"
                                    className="edit-input"
                                />
                            </div>
                            <div className="edit-buttons">
                                <button
                                    className="edit-button"
                                    onClick={handleSave}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Saving...' : 'Save'}
                                </button>
                                <button className="edit-button" onClick={handleCancel}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>
                            Welcome back
                            <br />
                            {profileData?.body.firstName} {profileData?.body.lastName}!
                        </h1>
                        <button className="edit-button" onClick={() => setIsEditing(true)}>
                            Edit Name
                        </button>
                    </>
                )}
            </div>
            <h2 className="sr-only">Accounts</h2>
            {accounts.map((account, index) => (
                <AccountCard
                    key={index}
                    title={account.title}
                    amount={account.amount}
                    description={account.description}
                />
            ))}
        </main>
    );
};

export default Profile;
