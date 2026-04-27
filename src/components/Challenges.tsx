import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';

export default function Challenges() {
  return (
    <section id="challenges" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-rose-900/20 via-background to-background" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Challenges</h2>
          <p className="text-muted-foreground">Test your skills with our cybersecurity challenges</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden">
            <div className="relative h-48">
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop"
                alt="Networking Challenge"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Network className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle>Networking Challenge</CardTitle>
                  <CardDescription>Test your networking skills with our latest challenge</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <a href="https://surveyheart.com/form/670f7d6481d71a690249bc8a" target="_blank" rel="noopener noreferrer">
                <Button className="w-full">Register Now</Button>
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}