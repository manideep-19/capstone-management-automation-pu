import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { getUsers, getProjects, getTeams, addTeam, updateTeams, initializeMockData } from '@/lib/mockData';
import { User, Project, Team, TeamInvite } from '@/types/user';
import { Users, BookOpen, Plus, Mail } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    initializeMockData();
    const allUsers = getUsers();
    const allProjects = getProjects();
    const allTeams = getTeams();
    
    setUsers(allUsers);
    setProjects(allProjects);
    setTeams(allTeams);

    // Find user's team
    const userTeam = allTeams.find(team => 
      team.members.includes(user?.id || '') || team.leaderId === user?.id
    );
    setMyTeam(userTeam || null);
  }, [user]);

  const handleCreateTeam = () => {
    if (!newTeamName || !user) return;

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      members: [user.id],
      leaderId: user.id,
      status: 'forming',
      invites: [],
      createdAt: new Date()
    };

    addTeam(newTeam);
    setTeams([...teams, newTeam]);
    setMyTeam(newTeam);
    setNewTeamName('');
    setMessage('Team created successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleInviteMember = () => {
    if (!inviteEmail || !myTeam) return;

    const invitedUser = users.find(u => u.email.toLowerCase() === inviteEmail.toLowerCase() && u.role === 'student');
    if (!invitedUser) {
      setMessage('Student not found with this email. Make sure the student has registered with this email address.');
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    if (myTeam.members.includes(invitedUser.id)) {
      setMessage('User is already a team member');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Check if user is already in another team
    const userInOtherTeam = teams.find(team => 
      team.id !== myTeam.id && team.members.includes(invitedUser.id)
    );
    if (userInOtherTeam) {
      setMessage('User is already in another team');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Check if user already has a pending invite
    const existingInvite = myTeam.invites.find(invite => 
      invite.invitedUserId === invitedUser.id && invite.status === 'pending'
    );
    if (existingInvite) {
      setMessage('User already has a pending invitation');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const newInvite: TeamInvite = {
      id: Date.now().toString(),
      teamId: myTeam.id,
      invitedUserId: invitedUser.id,
      status: 'pending',
      createdAt: new Date()
    };

    const updatedTeam = {
      ...myTeam,
      invites: [...myTeam.invites, newInvite]
    };

    const updatedTeams = teams.map(team => 
      team.id === myTeam.id ? updatedTeam : team
    );

    updateTeams(updatedTeams);
    setTeams(updatedTeams);
    setMyTeam(updatedTeam);
    setInviteEmail('');
    setMessage(`Invitation sent to ${invitedUser.name} (${invitedUser.email})`);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleSelectProject = () => {
    if (!selectedProject || !myTeam) return;

    const updatedTeam = {
      ...myTeam,
      projectId: selectedProject,
      status: 'assigned' as const
    };

    const updatedTeams = teams.map(team => 
      team.id === myTeam.id ? updatedTeam : team
    );

    updateTeams(updatedTeams);
    setTeams(updatedTeams);
    setMyTeam(updatedTeam);
    setMessage('Project selected successfully! Waiting for guide assignment.');
    setTimeout(() => setMessage(''), 5000);
  };

  const availableProjects = projects.filter(p => !p.isAssigned);
  const myProject = myTeam?.projectId ? projects.find(p => p.id === myTeam.projectId) : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome, {user?.name}
        </div>
      </div>

      {message && (
        <Alert className={message.includes('successfully') || message.includes('sent to') ? 'border-green-500 bg-green-50' : ''}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myTeam ? myTeam.name : 'No Team'}
            </div>
            <p className="text-xs text-muted-foreground">
              {myTeam ? `${myTeam.members.length} members` : 'Create or join a team'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Status</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myProject ? 'Assigned' : 'Not Selected'}
            </div>
            <p className="text-xs text-muted-foreground">
              {myProject ? myProject.title : 'Select a project'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Status</CardTitle>
            <Badge variant="secondary">{myTeam?.status || 'No Team'}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myTeam?.invites.filter(i => i.status === 'pending').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Pending invites</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="team" className="w-full">
        <TabsList>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="projects">Project Selection</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          {!myTeam ? (
            <Card>
              <CardHeader>
                <CardTitle>Create a Team</CardTitle>
                <CardDescription>Start by creating your capstone project team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name"
                  />
                </div>
                <Button onClick={handleCreateTeam} disabled={!newTeamName}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{myTeam.name}</CardTitle>
                  <CardDescription>Team Leader: {users.find(u => u.id === myTeam.leaderId)?.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Team Members</h4>
                      <div className="space-y-2">
                        {myTeam.members.map(memberId => {
                          const member = users.find(u => u.id === memberId);
                          return member ? (
                            <div key={memberId} className="flex items-center space-x-2">
                              <Badge variant="outline">{member.name}</Badge>
                              {memberId === myTeam.leaderId && (
                                <Badge variant="default">Leader</Badge>
                              )}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {myTeam.leaderId === user?.id && (
                      <div className="space-y-2">
                        <Label htmlFor="inviteEmail">Invite Team Member</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="inviteEmail"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="Enter student email (e.g., student.rollno@presidencyuniversity.in)"
                          />
                          <Button onClick={handleInviteMember} disabled={!inviteEmail}>
                            <Mail className="h-4 w-4 mr-2" />
                            Invite
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Available students: nehashree.20221CIT0083@presidencyuniversity.in, john.2022CSE001@presidencyuniversity.in, sarah.2022IT002@presidencyuniversity.in
                        </p>
                      </div>
                    )}

                    {myTeam.invites.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Pending Invitations</h4>
                        <div className="space-y-2">
                          {myTeam.invites.map(invite => {
                            const invitedUser = users.find(u => u.id === invite.invitedUserId);
                            return invitedUser ? (
                              <div key={invite.id} className="flex items-center justify-between">
                                <span>{invitedUser.name} ({invitedUser.email})</span>
                                <Badge variant="outline">{invite.status}</Badge>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Projects</CardTitle>
              <CardDescription>
                {myProject ? `Current Project: ${myProject.title}` : 'Select a project for your team'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!myTeam ? (
                <Alert>
                  <AlertDescription>You need to create or join a team before selecting a project.</AlertDescription>
                </Alert>
              ) : myProject ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{myProject.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{myProject.description}</p>
                    <Badge className="mt-2">{myProject.specialization}</Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {availableProjects.map(project => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{project.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                            <Badge className="mt-2">{project.specialization}</Badge>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSelectedProject(project.id)}
                            variant={selectedProject === project.id ? "default" : "outline"}
                          >
                            {selectedProject === project.id ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedProject && (
                    <Button onClick={handleSelectProject} className="w-full">
                      Confirm Project Selection
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Monitor your project progress and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              {!myProject ? (
                <Alert>
                  <AlertDescription>Select a project to start tracking progress.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    Progress tracking features will be available once your team is assigned a guide and reviewer.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};