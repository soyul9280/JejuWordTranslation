import multiprocessing

workers = 36


# Nginx server 블록에서 설정한 내부 소켓 경로 사용​

bind = 'unix:/tmp/gopdak.sock'


# wsgi_app 지정​

# 명령어로 입력했던 'hello_cju:create_app()'을 설정 파일에서 지정​

wsgi_app = 'app:app'


errorlog = './gunicorn_log/errorlog.txt'

accesslog = './gunicorn_log/accesslog.txt'