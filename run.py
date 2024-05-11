from app import app

# 서버 실행
if __name__ == "__main__":
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.secret_key = 'njsdgvnjklsdfvnjkl'
    app.run(debug=True)
