#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'speedreadingapp.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()



"""
Extra Json document stuff for firebase if needed

config = {
    apiKey: "AIzaSyBLgExJ7nYlJkGPkydyFrxhZPXv6irstXM",
    authDomain: "speedreading-webapp.firebaseapp.com",
    databaseURL: "https://console.firebase.google.com/u/0/project/speedreading-webapp/database/speedreading-webapp-default-rtdb/data/~2F",
    projectId: "speedreading-webapp",
    storageBucket: "speedreading-webapp.appspot.com",
    messagingSenderId: "187526842244",
    appId: "1:187526842244:web:112d30b0c4efe9b230bfd1",
}
"""