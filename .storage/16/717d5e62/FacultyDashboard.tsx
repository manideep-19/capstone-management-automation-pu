import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { getUsers, getProjects, getTeams, initializeMockData } from '@/lib/mockData';
import { User, Project, Team } from '@/types/user';
import { Users, BookOpen, MessageSquare, Star } from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [assignedTeams, setAssignedTeams] = useState<Team[]>([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    initializeMockData();
    const allUsers = getUsers();
    const allProjects = getProjects();
    const allTeams = getTeams();
    
    setUsers(allUsers);
    setProjects(allProjects);
    setTeams(allTeams);

    // Find teams assigned to this faculty member
    const myAssignedTeams = allTeams.filter(team => 
      team.guideId === user?.id || team.reviewerId === user?.id
    );
    setAssignedTeams(myAssignedTeams);
  }, [user]);

  const getTeamMembers = (team: Team) => {
    return team.members.map(memberId => 
      users.find(u => u.id === memberId)
    ).filter(Boolean) as User[];
  };

  const getProjectTitle = (projectId?: string) => {
    if (!projectId) return 'No project assigned';
    const project = projects.find(p => p.id === projectId);
    return project?.title || 'Unknown project';
  };

  const handleSubmitFeedback = (teamId: string) => {
    // In a real app, this would save to database
    console.log(`Feedback for team ${teamId}:`, feedback);
    setFeedback('');
    // Show success message
  };

  const stats = {
    assignedTeams: assignedTeams.length,
    maxTeams: user?.maxTeams || 3,
    availableSlots: (user?.maxTeams || 3) - assignedTeams.length,
    completedReviews: 0 // This would be calculated from evaluations
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {user?.role === 'faculty' ? 'Faculty Guide' : 'Reviewer'} Dashboard
        </h1>
        <div className="text-sm text-muted-foreground">
          Welcome, {user?.name}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedTeams}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.maxTeams} maximum
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableSlots}</div>
            <p className="text-xs text-muted-foreground">
              teams can be assigned
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Specialization</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{user?.specialization}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedReviews}</div>
            <p className="text-xs text-muted-foreground">completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList>
          <TabsTrigger value="teams">My Teams</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Teams</CardTitle>
              <CardDescription>
                Teams assigned to you as {user?.role === 'faculty' ? 'guide' : 'reviewer'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedTeams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No teams assigned yet. The admin will assign teams based on specialization and availability.
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedTeams.map((team) => {
                    const members = getTeamMembers(team);
                    const projectTitle = getProjectTitle(team.projectId);
                    
                    return (
                      <Card key={team.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{team.name}</CardTitle>
                              <CardDescription>{projectTitle}</CardDescription>
                            </div>
                            <Badge variant="secondary">{team.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Team Members:</h4>
                              <div className="flex flex-wrap gap-2">
                                {members.map((member) => (
                                  <Badge key={member.id} variant="outline">
                                    {member.name} {member.rollNo && `(${member.rollNo})`}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Add Feedback
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add Feedback for {team.name}</DialogTitle>
                                    <DialogDescription>
                                      Provide feedback and suggestions for the team
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="feedback">Feedback</Label>
                                      <Textarea
                                        id="feedback"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Enter your feedback here..."
                                        rows={4}
                                      />
                                    </div>
                                    <Button 
                                      onClick={() => handleSubmitFeedback(team.id)}
                                      className="w-full"
                                    >
                                      Submit Feedback
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button size="sm">
                                Schedule Review
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Evaluations</CardTitle>
              <CardDescription>Evaluate team progress and assign marks</CardDescription>
            </CardHeader>
            <CardContent>
              {assignedTeams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No teams to evaluate
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Phase</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell>{getProjectTitle(team.projectId)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Proposal</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Pending</Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Evaluate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Schedule</CardTitle>
              <CardDescription>Manage review meetings and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Schedule management features coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};