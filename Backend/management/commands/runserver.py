from django.core.management.commands.runserver import Command as RunserverCommand
from django.core.management import call_command

class Command(RunserverCommand):
    def handle(self, *args, **options):
        # Run migrations before starting the server
        print("🔄 Running migrations before starting the server...")
        call_command("migrate")
        print("✅ Migrations completed.")
        
        # Call the original runserver command
        super().handle(*args, **options)
