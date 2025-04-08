#!/usr/bin/env python3
import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    '.js': 'application/javascript',
    '.json': 'application/json',
})

print(f"サーバーを起動しています... http://localhost:{PORT} にアクセスしてください")
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Ctrl+Cで終了できます")
    httpd.serve_forever()
