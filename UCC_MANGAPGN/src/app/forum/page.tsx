import { forumThreads } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, MessageSquare, User } from 'lucide-react';
import Link from 'next/link';

export default function ForumPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Community Forum</h1>
          <p className="text-lg text-muted-foreground mt-2">Discuss your favorite manga with the community.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New Post
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Topic</TableHead>
              <TableHead className="text-center">Replies</TableHead>
              <TableHead>Last Post</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forumThreads.map((thread) => (
              <TableRow key={thread.id} className="hover:bg-muted/50">
                <TableCell>
                  <Link href="#" className="font-medium text-base hover:text-primary transition-colors">{thread.title}</Link>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <User className="h-4 w-4 mr-1" />
                    <span>by {thread.author} on {thread.date}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{thread.replies}</span>
                    </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>by {thread.lastReply.author}</p>
                    <p className="text-muted-foreground">{thread.lastReply.date}</p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
