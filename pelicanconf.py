#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Artur Magalhães'
SITENAME = 'Tuts Blog'
SITEURL = ''

# Favicon load
STATIC_PATHS = ['extra']
EXTRA_PATH_METADATA = {'extra/favicon.ico': {'path': 'favicon.ico'},}

PATH = 'content'
THEME = 'pelican/lib/python3.7/site-packages/pelican/themes/zurb-F5-basic'

# Articles and pages paths
ARTICLE_URL = 'posts/{date:%Y}/{date:%b}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'posts/{date:%Y}/{date:%b}/{date:%d}/{slug}.html'
PAGE_URL = 'pages/{slug}/'
PAGE_SAVE_AS = 'pages/{slug}.html'

# Language and hour configs
DEFAULT_LANG = 'pt-br'
TIMEZONE = 'America/Sao_Paulo'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None


# Blogroll
# LINKS = (('Pelican', 'http://getpelican.com/'),
        # ('Python.org', 'http://python.org/'),
        # ('Jinja2', 'http://jinja.pocoo.org/'),
        # ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('LinkedIn', 'https://www.linkedin.com/in/arturmrsantos/'),
          ('Github', 'https://github.com/tutss'),
          ('Email me', 'mailto:artur_santos@usp.br'))

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
