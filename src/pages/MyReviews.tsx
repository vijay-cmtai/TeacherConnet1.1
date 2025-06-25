
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Plus, Edit, Trash2, Building, Calendar, ThumbsUp, MessageSquare } from 'lucide-react';

const MyReviews = () => {
  const { t } = useTranslation();
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<number | null>(null);

  const [newReview, setNewReview] = useState({
    schoolName: '',
    position: '',
    rating: 5,
    title: '',
    review: '',
    pros: '',
    cons: '',
    advice: ''
  });

  const myReviews = [
    {
      id: 1,
      schoolName: 'Lincoln Elementary School',
      position: 'Mathematics Teacher',
      rating: 4,
      title: 'Great school with supportive administration',
      review: 'I worked at Lincoln Elementary for 3 years and had a wonderful experience. The administration is very supportive and the students are eager to learn.',
      pros: 'Supportive colleagues, good resources, professional development opportunities',
      cons: 'Limited parking, older building facilities',
      advice: 'Be prepared to collaborate closely with other teachers and participate in school events.',
      datePosted: '2024-01-10',
      likes: 12,
      replies: 3,
      isHelpful: true
    },
    {
      id: 2,
      schoolName: 'Oak Hill High School',
      position: 'Science Teacher',
      rating: 3,
      title: 'Mixed experience - good students, challenging environment',
      review: 'The students at Oak Hill are motivated and curious, but the school lacks some modern equipment for science labs.',
      pros: 'Motivated students, flexible schedule, good benefits',
      cons: 'Outdated lab equipment, limited budget for supplies',
      advice: 'Bring your own supplies when possible and be creative with limited resources.',
      datePosted: '2023-11-15',
      likes: 8,
      replies: 5,
      isHelpful: false
    }
  ];

  const renderStars = (rating: number, editable: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-secondary fill-secondary' : 'text-muted-foreground'
            } ${editable ? 'cursor-pointer hover:text-secondary' : ''}`}
            onClick={() => editable && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  const handleSubmitReview = () => {
    console.log('Submitting review:', newReview);
    setIsWritingReview(false);
    setNewReview({
      schoolName: '',
      position: '',
      rating: 5,
      title: '',
      review: '',
      pros: '',
      cons: '',
      advice: ''
    });
  };

  return (
    <div className="min-h-screen bg-page">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Reviews</h1>
                <p className="text-muted-foreground">Share your experiences and help other teachers</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsWritingReview(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Write Review
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{myReviews.length}</div>
                <div className="text-sm text-muted-foreground">Reviews Written</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary">
                  {myReviews.reduce((sum, review) => sum + review.likes, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-success">
                  {myReviews.filter(review => review.isHelpful).length}
                </div>
                <div className="text-sm text-muted-foreground">Helpful Reviews</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Write New Review Form */}
        {isWritingReview && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
              <CardDescription>Share your experience to help other teachers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={newReview.schoolName}
                    onChange={(e) => setNewReview({...newReview, schoolName: e.target.value})}
                    placeholder="Enter school name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Your Position</Label>
                  <Input
                    id="position"
                    value={newReview.position}
                    onChange={(e) => setNewReview({...newReview, position: e.target.value})}
                    placeholder="e.g., Mathematics Teacher"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Overall Rating</Label>
                {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  placeholder="Summarize your experience"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review">Review</Label>
                <Textarea
                  id="review"
                  value={newReview.review}
                  onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                  placeholder="Share your detailed experience..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pros">Pros</Label>
                  <Textarea
                    id="pros"
                    value={newReview.pros}
                    onChange={(e) => setNewReview({...newReview, pros: e.target.value})}
                    placeholder="What did you like?"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cons">Cons</Label>
                  <Textarea
                    id="cons"
                    value={newReview.cons}
                    onChange={(e) => setNewReview({...newReview, cons: e.target.value})}
                    placeholder="What could be improved?"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="advice">Advice for Teachers</Label>
                <Textarea
                  id="advice"
                  value={newReview.advice}
                  onChange={(e) => setNewReview({...newReview, advice: e.target.value})}
                  placeholder="What advice would you give to other teachers?"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmitReview}>Submit Review</Button>
                <Button variant="outline" onClick={() => setIsWritingReview(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Reviews List */}
        <div className="space-y-6">
          {myReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold text-foreground">{review.schoolName}</h3>
                      <Badge variant="outline">{review.position}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      {renderStars(review.rating)}
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(review.datePosted).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingReview(review.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h4 className="text-lg font-medium text-foreground mb-3">{review.title}</h4>
                <p className="text-foreground mb-4">{review.review}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <h5 className="font-medium text-success mb-2">Pros</h5>
                    <p className="text-sm text-foreground">{review.pros}</p>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <h5 className="font-medium text-destructive mb-2">Cons</h5>
                    <p className="text-sm text-foreground">{review.cons}</p>
                  </div>
                </div>

                <div className="p-3 bg-secondary/10 rounded-lg mb-4">
                  <h5 className="font-medium text-secondary mb-2">Advice for Teachers</h5>
                  <p className="text-sm text-foreground">{review.advice}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{review.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm">{review.replies} replies</span>
                    </div>
                  </div>
                  {review.isHelpful && (
                    <Badge variant="secondary">Marked as Helpful</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {myReviews.length === 0 && !isWritingReview && (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-4">
                Share your teaching experiences to help other educators make informed decisions.
              </p>
              <Button onClick={() => setIsWritingReview(true)}>
                Write Your First Review
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyReviews;
