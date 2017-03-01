import os
import tornado.ioloop
import tornado.web

class IndexPageHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

class NotificationPageHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("notifications.html")

class SubscriptionPageHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("subscriptions.html")

class RegisterAppPageHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("registerapp.html")

def make_app():
    settings = {
        "static_path": os.path.join(os.path.dirname(__file__), "static")
    }
    return tornado.web.Application([
        (r"/", IndexPageHandler),
		(r"/notifications", NotificationPageHandler),
		(r"/subscriptions", SubscriptionPageHandler),
		(r"/registerapp", RegisterAppPageHandler)
    ],**settings)

if __name__ == "__main__":
    app = make_app()
    app.listen(9110)
    tornado.ioloop.IOLoop.current().start()
