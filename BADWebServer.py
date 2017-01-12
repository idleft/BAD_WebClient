import os
import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

def make_app():
    settings = {
        "static_path": os.path.join(os.path.dirname(__file__), "static")
    }
    return tornado.web.Application([
        (r"/", MainHandler)
    ],**settings)

if __name__ == "__main__":
    app = make_app()
    app.listen(9110)
    tornado.ioloop.IOLoop.current().start()
