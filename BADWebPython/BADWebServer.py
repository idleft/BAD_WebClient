import os
import tornado.ioloop
import tornado.web

class IndexPageHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

def make_app():
    return tornado.web.Application([
    	(r'/(favicon.ico)', tornado.web.StaticFileHandler, {'path': ""}),
    	(r'/utils/(.*)', tornado.web.StaticFileHandler, {'path': "utils"}),
    	(r'/admin/(.*)', tornado.web.StaticFileHandler, {'path': "admin"}),
    	(r'/mgr/(.*)', tornado.web.StaticFileHandler, {'path': "mgr"}),
    	(r'/user/(.*)', tornado.web.StaticFileHandler, {'path': "user"}),
        (r'/', IndexPageHandler)
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(9110)
    tornado.ioloop.IOLoop.current().start()
