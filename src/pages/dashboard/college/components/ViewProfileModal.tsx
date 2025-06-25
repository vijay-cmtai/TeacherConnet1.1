import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Download, Briefcase, GraduationCap, Star, User, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const maskEmail = (email: string) => {
    if (!email) return "N/A";
    const [user, domain] = email.split("@");
    if (!domain) return email;
    const maskedUser = user.length <= 2 ? user[0] + '***' : user.slice(0, 2) + '***';
    return `${maskedUser}@${domain}`;
};

const maskPhone = (phone: string) => {
    if (!phone || phone.length < 10) return "N/A";
    return phone.slice(0, 2) + '******' + phone.slice(-2);
};

export const ViewProfileModal = ({ application, onClose }: { application: any, onClose: () => void }) => {
    if (!application) return null;

    const profile = application.user.employerProfile;
    const resumeRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const input = resumeRef.current;
        if (!input) {
            toast.error("Could not generate resume data.");
            return;
        }
        const loadingToast = toast.loading('Generating PDF...');
        html2canvas(input, { scale: 2 })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const ratio = canvas.width / canvas.height;
                const width = pdfWidth;
                const height = width / ratio;
                pdf.addImage(imgData, 'PNG', 0, 0, width, Math.min(height, pdfHeight));
                pdf.save(`${profile.name}_Profile.pdf`);
                toast.success('Profile downloaded!', { id: loadingToast });
            })
            .catch(() => toast.error('Failed to generate PDF.', { id: loadingToast }));
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{profile.name}</DialogTitle>
                    <DialogDescription>{profile.headline}</DialogDescription>
                </DialogHeader>
                <div ref={resumeRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 overflow-y-auto pr-2 flex-grow">
                    <div className="md:col-span-1 space-y-4 border-r pr-4">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                                <User className="w-12 h-12 text-muted-foreground" />
                            </div>
                        </div>
                        <Separator />
                        <h4 className="font-semibold">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2"><Mail size={14} className="text-muted-foreground" /><span>{maskEmail(application.user.email)}</span></div>
                            <div className="flex items-center gap-2"><Phone size={14} className="text-muted-foreground" /><span>{maskPhone(profile.phone)}</span></div>
                        </div>
                        <Separator />
                        <h4 className="font-semibold">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills?.length > 0 ? profile.skills.map((skill: any) => (<Badge key={skill._id} variant="secondary">{skill.name}</Badge>)) : <p className="text-sm text-muted-foreground">No skills listed.</p>}
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><Briefcase size={18} />Work Experience</h4>
                            <div className="space-y-4">
                                {profile.workExperience?.length > 0 ? profile.workExperience.map((exp: any, index: number) => (
                                    <div key={index} className="pl-4 border-l-2 border-border">
                                        <p className="font-semibold">{exp.title}</p>
                                        <p className="text-sm">{exp.company}</p>
                                        <p className="text-xs text-muted-foreground">{exp.duration}</p>
                                    </div>
                                )) : <p className="text-sm text-muted-foreground">No work experience provided.</p>}
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><GraduationCap size={18} />Education</h4>
                            <div className="space-y-4">
                                {profile.education?.length > 0 ? profile.education.map((edu: any, index: number) => (
                                    <div key={index} className="pl-4 border-l-2 border-border">
                                        <p className="font-semibold">{edu.degree}</p>
                                        <p className="text-sm">{edu.school}</p>
                                        <p className="text-xs text-muted-foreground">{edu.year}</p>
                                    </div>
                                )) : <p className="text-sm text-muted-foreground">No education details provided.</p>}
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><FileText size={18} />Documents</h4>
                            <div className="space-y-2">
                                {profile.documents?.length > 0 ? profile.documents.map((doc: any, index: number) => (
                                    <a key={index} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 bg-muted/50 rounded-md hover:bg-muted">
                                        <span className="text-sm font-medium truncate">{doc.name}</span>
                                        <Download size={16} />
                                    </a>
                                )) : <p className="text-sm text-muted-foreground">No documents uploaded.</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={handleDownload}><Download className="w-4 h-4 mr-2" />Download Resume</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};