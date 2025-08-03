from rest_framework.throttling import SimpleRateThrottle


class FeedbackRateThrottle(SimpleRateThrottle):
   scope = 'feedback'


   def get_cache_key(self, request, view):
       if request.user.is_authenticated:
           return self.cache_format % {
               'scope': self.scope,
               'ident': request.user.pk
           }
       return self.cache_format % {
           'scope': self.scope,
           'ident': self.get_ident(request)
       }
