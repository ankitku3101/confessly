'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { MagicCard } from '@/components/magicui/magic-card';

export default function ConfessionsPage() {
  const { theme } = useTheme();

  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [confessionType, setConfessionType] = useState('general');
  const [loading, setLoading] = useState(false);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setDialogMessage('Confession content cannot be empty.');
      setShowDialog(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          username,
          confession_type: confessionType,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setDialogMessage('Your confession has been submitted successfully!');
      setShowDialog(true);
      setContent('');
      setUsername('');
      setConfessionType('general');
    } catch (error: any) {
      setDialogMessage(error.message || 'Something went wrong');
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-white">
      <Card className="p-0 max-w-xl w-full shadow-none bg-card text-card-foreground">
        <MagicCard className="p-0" gradientColor="#262626">
          <CardHeader className="border-b border-border p-4 text-white">
            <CardTitle>Post a Confession (under development)</CardTitle>
            <CardDescription className="text-muted-foreground">
              Share anonymously. Your identity is safe with us.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="p-4 grid gap-4">
              <div className="grid gap-2">
                <Label className='text-white' htmlFor="confession">Confession</Label>
                <Textarea
                  id="confession"
                  placeholder="Type something you need to get off your chest..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="bg-background border border-border text-foreground"
                />
              </div>

              <div className="grid gap-2">
                <Label className='text-white' htmlFor="username">Username (optional)</Label>
                <Input
                  id="username"
                  placeholder="Anonymous"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background border border-border text-foreground"
                />
              </div>

              <div className="grid gap-2">
                <Label className='text-white' htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={confessionType}
                  onChange={(e) => setConfessionType(e.target.value)}
                  className="bg-background border border-border text-foreground rounded p-2"
                >
                  <option value="love">Love</option>
                  <option value="rant">Rant</option>
                  <option value="regret">Regret</option>
                  <option value="funny">Funny</option>
                  <option value="sad">Sad</option>
                  <option value="wholesome">Wholesome</option>
                  <option value="random">Random</option>
                </select>
              </div>
            </CardContent>

            <CardFooter className="p-4 border-t border-border">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </CardFooter>
          </form>
        </MagicCard>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card text-card-foreground border border-border">
          <DialogHeader>
            <DialogTitle>Confession Status</DialogTitle>
          </DialogHeader>
          <p>{dialogMessage}</p>
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowDialog(false)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
