// Helper function to create demo users for testing
// Run this in browser console after Firebase is set up

import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const createDemoUsers = async () => {
    const demoUsers = [
        {
            email: 'admin@college.edu',
            password: 'admin123',
            name: 'Admin User',
            role: 'admin',
            isVerified: true,
        },
        {
            email: 'faculty@college.edu',
            password: 'faculty123',
            name: 'Faculty User',
            role: 'faculty',
            specialization: 'Computer Science',
            isVerified: true,
        },
        {
            email: 'student@college.edu',
            password: 'student123',
            name: 'Student User',
            role: 'student',
            rollNo: '20221CIT0091',
            isVerified: true,
        },
    ];

    for (const userData of demoUsers) {
        try {
            const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const uid = cred.user.uid;

            const profileDoc = {
                email: userData.email,
                name: userData.name,
                role: userData.role,
                isVerified: userData.isVerified,
                specialization: userData.specialization || null,
                rollNo: userData.rollNo || null,
                maxTeams: userData.role === 'faculty' || userData.role === 'reviewer' ? 3 : null,
                createdAt: serverTimestamp(),
            };

            await setDoc(doc(db, 'users', uid), profileDoc);
            console.log(`Created demo user: ${userData.email}`);
        } catch (error) {
            console.error(`Failed to create user ${userData.email}:`, error);
        }
    }
};

// Uncomment the line below to create demo users
// createDemoUsers();
