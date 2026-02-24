from django.apps import AppConfig
from django.core.management import call_command


class CommonConfig(AppConfig):
    name = 'common'

    def ready(self):
        import common.signals
        try: 
            call_command('run_setup')
        except Exception as e:
            print(e)