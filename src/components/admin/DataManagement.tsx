import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Edit, Plus, Download, CheckCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';

interface DataManagementProps {
    dataType: 'students' | 'faculty' | 'projects';
}

export const DataManagement: React.FC<DataManagementProps> = ({ dataType }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, [dataType]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const collectionName = dataType === 'projects' ? 'projects' : 'users';
            const querySnapshot = await getDocs(collection(db, collectionName));

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fetchedData: any[] = [];
            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                if (dataType === 'projects') {
                    fetchedData.push({ id: doc.id, ...docData });
                } else {
                    // Filter users by role
                    if (docData.role === dataType.slice(0, -1)) { // Remove 's' from 'students'/'faculty'
                        fetchedData.push({ id: doc.id, ...docData });
                    }
                }
            });

            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return;

        try {
            const collectionName = dataType === 'projects' ? 'projects' : 'users';
            await deleteDoc(doc(db, collectionName, id));
            setData(data.filter(item => item.id !== id));
            setSuccess('Record deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error deleting record:', error);
            setError('Failed to delete record');
        }
    };

    const handleVerifyUser = async (id: string) => {
        try {
            await updateDoc(doc(db, 'users', id), { isVerified: true });
            setData(data.map(item => item.id === id ? { ...item, isVerified: true } : item));
            setSuccess('User verified successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error verifying user:', error);
            setError('Failed to verify user');
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete all ${dataType}?`)) return;

        try {
            const collectionName = dataType === 'projects' ? 'projects' : 'users';
            const deletePromises = data.map(item => deleteDoc(doc(db, collectionName, item.id)));
            await Promise.all(deletePromises);
            setData([]);
            setSuccess(`All ${dataType} deleted successfully`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error bulk deleting:', error);
            setError('Failed to delete records');
        }
    };

    const handleExport = () => {
        const exportData = data.map(item => {
            if (dataType === 'students') {
                return {
                    Name: item.name,
                    Email: item.email,
                    'Roll Number': item.rollNo,
                    Specialization: item.specialization,
                    'Is Verified': item.isVerified
                };
            } else if (dataType === 'faculty') {
                return {
                    Name: item.name,
                    Email: item.email,
                    Specialization: item.specialization,
                    'Max Teams': item.maxTeams,
                    'Is Verified': item.isVerified
                };
            } else {
                return {
                    Title: item.title,
                    Description: item.description,
                    Specialization: item.specialization,
                    'Is Assigned': item.isAssigned
                };
            }
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, dataType);
        XLSX.writeFile(wb, `${dataType}_export.xlsx`);
    };

    const getTableHeaders = () => {
        switch (dataType) {
            case 'students':
                return ['Name', 'Email', 'Roll Number', 'Specialization', 'Verified', 'Actions'];
            case 'faculty':
                return ['Name', 'Email', 'Specialization', 'Max Teams', 'Verified', 'Actions'];
            case 'projects':
                return ['Title', 'Description', 'Specialization', 'Assigned', 'Actions'];
            default:
                return [];
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderTableRow = (item: any) => {
        switch (dataType) {
            case 'students':
                return (
                    <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.rollNo}</TableCell>
                        <TableCell>{item.specialization}</TableCell>
                        <TableCell>
                            <Badge variant={item.isVerified ? 'default' : 'secondary'}>
                                {item.isVerified ? 'Verified' : 'Pending'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                {!item.isVerified && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleVerifyUser(item.id)}
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            case 'faculty':
                return (
                    <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.specialization}</TableCell>
                        <TableCell>{item.maxTeams}</TableCell>
                        <TableCell>
                            <Badge variant={item.isVerified ? 'default' : 'secondary'}>
                                {item.isVerified ? 'Verified' : 'Pending'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                {!item.isVerified && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleVerifyUser(item.id)}
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            case 'projects':
                return (
                    <TableRow key={item.id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                        <TableCell>{item.specialization}</TableCell>
                        <TableCell>
                            <Badge variant={item.isAssigned ? 'default' : 'secondary'}>
                                {item.isAssigned ? 'Assigned' : 'Available'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">Loading...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="capitalize">{dataType} Management</CardTitle>
                        <CardDescription>
                            Manage {dataType} data. Total records: {data.length}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        {data.length > 0 && (
                            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete All
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {success && (
                    <Alert className="mb-4">
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {data.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No {dataType} found. Upload an Excel file to get started.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {getTableHeaders().map((header) => (
                                        <TableHead key={header}>{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map(renderTableRow)}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
