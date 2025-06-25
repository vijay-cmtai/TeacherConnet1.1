
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Search, Filter, Users } from 'lucide-react';

const Messages = () => {
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'HR Manager',
      lastMessage: 'Thank you for your application. We would like to schedule an interview.',
      time: '2 hours ago',
      unread: true,
      avatar: '👩‍💼'
    },
    {
      id: 2,
      name: 'Lincoln Elementary',
      role: 'School District',
      lastMessage: 'Your profile matches our requirements for the Math Teacher position.',
      time: '1 day ago',
      unread: false,
      avatar: '🏫'
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Principal',
      lastMessage: 'We have reviewed your credentials and are impressed with your experience.',
      time: '3 days ago',
      unread: false,
      avatar: '👨‍🏫'
    }
  ];

  const currentMessages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      message: 'Hello! Thank you for applying to our Math Teacher position.',
      time: '10:30 AM',
      isMe: false
    },
    {
      id: 2,
      sender: 'Me',
      message: 'Thank you for considering my application. I am very excited about this opportunity.',
      time: '10:35 AM',
      isMe: true
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      message: 'We would like to schedule an interview with you. Are you available this Friday at 2 PM?',
      time: '11:20 AM',
      isMe: false
    }
  ];

  return (
    <div className="min-h-screen bg-page">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">Connect with employers and manage your communications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Conversations
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 hover:bg-muted/50 cursor-pointer border-l-4 transition-colors ${
                      conversation.unread ? 'border-l-primary bg-primary/5' : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{conversation.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-medium truncate ${conversation.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {conversation.name}
                          </p>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{conversation.role}</p>
                        <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread && (
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="text-2xl">👩‍💼</div>
                <div>
                  <CardTitle>Sarah Johnson</CardTitle>
                  <CardDescription>HR Manager at Lincoln Elementary</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isMe
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[40px] max-h-32 resize-none"
                    rows={1}
                  />
                  <Button size="icon" className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
