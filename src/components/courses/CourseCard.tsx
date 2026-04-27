import { Code2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { formatPrice } from '@/lib/utils';
import { CourseProps } from '@/types/courses';

export default function CourseCard({
  title,
  description,
  image,
  prelaunchPrice,
  originalPrice,
  enrollLink
}: CourseProps) {
  return (
    <Card className="overflow-hidden group hover:border-primary/50 transition-colors">
      <div className="relative h-48">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <CardHeader className="relative">
        <div className="absolute top-4 right-4">
          <Code2 className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Prelaunch Price</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(prelaunchPrice)}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-muted-foreground">Original Price</p>
              <p className="text-xl text-muted-foreground line-through">{formatPrice(originalPrice)}</p>
            </div>
          </div>
          <a href={enrollLink} target="_blank" rel="noopener noreferrer">
            <Button className="w-full">Enroll Now</Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}