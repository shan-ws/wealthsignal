#!/usr/bin/perl
use strict;
use warnings;
use IO::Socket::INET;
use Cwd 'abs_path';
use File::Basename 'dirname';

my $port = 3000;
my $root = dirname(abs_path($0));

my $server = IO::Socket::INET->new(
    LocalPort => $port,
    Type      => SOCK_STREAM,
    Reuse     => 1,
    Listen    => 20
) or die "Cannot create socket on port $port: $!\n";

print "Wealth Signal HTTP Server running on http://127.0.0.1:$port\n";
print "Serving files from $root\n";

my %mimes = (
    'html' => 'text/html; charset=UTF-8',
    'css'  => 'text/css; charset=UTF-8',
    'js'   => 'application/javascript; charset=UTF-8',
    'json' => 'application/json',
    'png'  => 'image/png',
    'jpg'  => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'svg'  => 'image/svg+xml',
    'ico'  => 'image/x-icon'
);

while (my $client = $server->accept()) {
    my $request_line = <$client>;
    next unless defined $request_line;

    # Consume remaining headers
    while (my $line = <$client>) {
        last if $line =~ /^\r?\n$/;
    }

    if ($request_line =~ /^(GET|HEAD)\s+([^\s?]+)/) {
        my $method = $1;
        my $path = $2;
        $path = '/index.html' if $path eq '/' or $path eq '';
        
        # Remove leading slash and prevent directory traversal
        $path =~ s|^/||;
        $path =~ s|\.\.||g;

        my $file_path = "$root/$path";
        if (-f $file_path) {
            my ($ext) = $file_path =~ /\.([a-zA-Z0-9]+)$/;
            $ext = lc($ext || '');
            my $mime = $mimes{$ext} || 'application/octet-stream';

            if (open my $fh, '<:raw', $file_path) {
                my $content = do { local $/; <$fh> };
                close $fh;
                my $len = length($content);

                print $client "HTTP/1.1 200 OK\r\n";
                print $client "Content-Type: $mime\r\n";
                print $client "Content-Length: $len\r\n";
                print $client "Connection: close\r\n\r\n";
                print $client $content;
            } else {
                send_response($client, 500, "500 Internal Server Error");
            }
        } else {
            send_response($client, 404, "404 Not Found");
        }
    } else {
        send_response($client, 400, "400 Bad Request");
    }

    close $client;
}

sub send_response {
    my ($client, $code, $msg) = @_;
    print $client "HTTP/1.1 $code $msg\r\nContent-Type: text/plain\r\nConnection: close\r\n\r\n$msg\n";
}
