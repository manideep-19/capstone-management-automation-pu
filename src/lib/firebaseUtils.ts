import { db } from './firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    writeBatch,
    serverTimestamp,
    getDocs,
    query,
    where
} from 'firebase/firestore';

export interface StudentData {
    name: string;
    email: string;
    rollNo: string;
    specialization: string;
    isVerified: boolean;
    role: 'student';
    createdAt: Date;
}

export interface FacultyData {
    name: string;
    email: string;
    specialization: string; // Will store School value
    maxTeams: number;
    isVerified: boolean;
    role: 'faculty';
    createdAt: Date;
    // Additional fields
    title?: string;
    designation?: string;
    contactNumber?: string;
    employeeId?: string;
    school?: string;
}

export interface ProjectData {
    title: string;
    description: string;
    specialization: string;
    isAssigned: boolean;
    createdAt: Date;
}

// Bulk upload students to Firestore
export const bulkUploadStudents = async (students: StudentData[]): Promise<{ success: number; errors: string[] }> => {
    const batch = writeBatch(db);
    const errors: string[] = [];
    let successCount = 0;

    try {
        // Check for duplicates in Firestore first
        const usersRef = collection(db, 'users');
        const existingUsers = await getDocs(query(usersRef, where('role', '==', 'student')));
        const existingEmails = new Set(existingUsers.docs.map(doc => doc.data().email.toLowerCase()));

        for (const student of students) {
            try {
                // Validate required fields
                if (!student.name || !student.email || !student.rollNo) {
                    errors.push(`Missing required fields for student: ${student.name || student.email || 'Unknown'}`);
                    continue;
                }

                // Check for duplicate email
                if (existingEmails.has(student.email.toLowerCase())) {
                    errors.push(`Duplicate email: ${student.email}`);
                    continue;
                }

                const docRef = doc(collection(db, 'users'));
                batch.set(docRef, {
                    ...student,
                    email: student.email.toLowerCase(),
                    createdAt: serverTimestamp(),
                });
                successCount++;
                existingEmails.add(student.email.toLowerCase());
            } catch (error) {
                errors.push(`Failed to add student ${student.name}: ${error}`);
            }
        }

        await batch.commit();
        console.log(`✅ Successfully uploaded ${successCount} students`);
        return { success: successCount, errors };
    } catch (error) {
        console.error('❌ Bulk upload error:', error);
        throw new Error('Failed to upload students');
    }
};

// Bulk upload faculty to Firestore
export const bulkUploadFaculty = async (faculty: FacultyData[]): Promise<{ success: number; errors: string[] }> => {
    const batch = writeBatch(db);
    const errors: string[] = [];
    let successCount = 0;

    try {
        // Check for duplicates
        const usersRef = collection(db, 'users');
        const existingUsers = await getDocs(query(usersRef, where('role', '==', 'faculty')));
        const existingEmails = new Set(existingUsers.docs.map(doc => doc.data().email.toLowerCase()));

        for (const member of faculty) {
            try {
                // Validate required fields
                if (!member.name || !member.email) {
                    errors.push(`Missing required fields for faculty: ${member.name || member.email || 'Unknown'}`);
                    continue;
                }

                // Check for duplicate email
                if (existingEmails.has(member.email.toLowerCase())) {
                    errors.push(`Duplicate email: ${member.email}`);
                    continue;
                }

                const docRef = doc(collection(db, 'users'));
                batch.set(docRef, {
                    ...member,
                    email: member.email.toLowerCase(),
                    createdAt: serverTimestamp(),
                });
                successCount++;
                existingEmails.add(member.email.toLowerCase());
            } catch (error) {
                errors.push(`Failed to add faculty ${member.name}: ${error}`);
            }
        }

        await batch.commit();
        console.log(`✅ Successfully uploaded ${successCount} faculty members`);
        return { success: successCount, errors };
    } catch (error) {
        console.error('❌ Bulk upload error:', error);
        throw new Error('Failed to upload faculty');
    }
};

// Bulk upload projects to Firestore
export const bulkUploadProjects = async (projects: ProjectData[]): Promise<{ success: number; errors: string[] }> => {
    const batch = writeBatch(db);
    const errors: string[] = [];
    let successCount = 0;

    try {
        for (const project of projects) {
            try {
                if (!project.title) {
                    errors.push('Missing project title');
                    continue;
                }

                const docRef = doc(collection(db, 'projects'));
                batch.set(docRef, {
                    ...project,
                    createdAt: serverTimestamp(),
                });
                successCount++;
            } catch (error) {
                errors.push(`Failed to add project ${project.title}: ${error}`);
            }
        }

        await batch.commit();
        console.log(`✅ Successfully uploaded ${successCount} projects`);
        return { success: successCount, errors };
    } catch (error) {
        console.error('❌ Bulk upload error:', error);
        throw new Error('Failed to upload projects');
    }
};

// Delete all students
export const deleteAllStudents = async (): Promise<void> => {
    const studentsQuery = query(collection(db, 'users'), where('role', '==', 'student'));
    const snapshot = await getDocs(studentsQuery);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
};

// Delete all faculty
export const deleteAllFaculty = async (): Promise<void> => {
    const facultyQuery = query(collection(db, 'users'), where('role', '==', 'faculty'));
    const snapshot = await getDocs(facultyQuery);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
};

// Delete all projects
export const deleteAllProjects = async (): Promise<void> => {
    const snapshot = await getDocs(collection(db, 'projects'));

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
};

// Update user verification status
export const updateUserVerification = async (userId: string, isVerified: boolean): Promise<void> => {
    await updateDoc(doc(db, 'users', userId), {
        isVerified,
    });
};

// Update project assignment status
export const updateProjectAssignment = async (projectId: string, isAssigned: boolean, guideId?: string, reviewerId?: string): Promise<void> => {
    const updateData: any = { isAssigned };
    if (guideId) updateData.guideId = guideId;
    if (reviewerId) updateData.reviewerId = reviewerId;

    await updateDoc(doc(db, 'projects', projectId), updateData);
};
