from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3, smtplib
from email.message import EmailMessage
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- ការកំណត់ Gmail (Configuration) ---
ADMIN_GMAIL = "irra11store@gmail.com"
GMAIL_APP_PASSWORD = "scvo cdjt ucdw kvii"

def init_db():
    with sqlite3.connect('orders.db') as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gmail TEXT, skin_name TEXT, amount TEXT,
            status TEXT DEFAULT 'Pending', timestamp TEXT)''')

@app.route('/api/save-order', methods=['POST'])
def save_order():
    try:
        data = request.json
        gmail = data.get('gmailAddress')
        skin = data.get('product', {}).get('name')
        amount = data.get('totalAmount')
        time_now = datetime.now().strftime("%d-%b-%Y %I:%M %p")

        with sqlite3.connect('orders.db') as conn:
            conn.execute("INSERT INTO orders (gmail, skin_name, amount, timestamp) VALUES (?, ?, ?, ?)", 
                           (gmail, skin, f"${amount}", time_now))
            conn.commit()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/admin/orders', methods=['GET'])
def get_orders():
    try:
        with sqlite3.connect('orders.db') as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM orders ORDER BY id DESC")
            return jsonify([dict(row) for row in cursor.fetchall()])
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/admin/edit-order', methods=['POST'])
def edit_order():
    data = request.json
    try:
        with sqlite3.connect('orders.db') as conn:
            conn.execute("UPDATE orders SET gmail = ?, skin_name = ?, amount = ? WHERE id = ?", 
                         (data['gmail'], data['skin_name'], data['amount'], data['id']))
            conn.commit()
        return jsonify({"status": "updated"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/admin/delete-order', methods=['POST'])
def delete_order():
    data = request.json
    try:
        with sqlite3.connect('orders.db') as conn:
            conn.execute("DELETE FROM orders WHERE id = ?", (data['id'],))
            conn.commit()
        return jsonify({"status": "deleted"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# --- មុខងារផ្ញើ Email ជា HTML UI ---
@app.route('/api/admin/send-response', methods=['POST'])
def send_response():
    data = request.json
    recipient = data.get('gmail')
    message_content = data.get('message')
    email_subject = data.get('subject')
    order_id = data.get('id')

    # កំណត់ពណ៌ និង Icon តាមស្ថានភាព
    is_success = 'ជោគជ័យ' in email_subject
    theme_color = "#27ae60" if is_success else "#e74c3c"
    status_icon = "✅" if is_success else "❌"
    
    # រៀបចំសារជា HTML (ជំនួស \n ដោយ <br>)
    formatted_message = message_content.replace('\n', '<br>')

    # HTML Template សម្រាប់ Email
    html_body = f"""
    <html>
    <head>
        <style>
            .container {{ font-family: 'Hanuman', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }}
            .header {{ background-color: {theme_color}; color: white; padding: 25px; text-align: center; }}
            .content {{ padding: 30px; line-height: 1.8; color: #333; background-color: #ffffff; }}
            .footer {{ background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }}
            .button {{ display: inline-block; padding: 12px 25px; margin-top: 20px; background-color: {theme_color}; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }}
            .status-tag {{ font-size: 24px; font-weight: bold; margin-bottom: 10px; display: block; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <span class="status-tag">{status_icon} {email_subject}</span>
                <p style="margin:0; opacity: 0.9;">ការបញ្ជាទិញលេខរៀង: #{order_id}</p>
            </div>
            <div class="content">
                <p style="font-size: 16px;">{formatted_message}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
                <p style="text-align: center; margin-bottom: 0;">ប្រសិនបើអ្នកមានចម្ងល់ សូមទាក់ទងមកកាន់យើងខ្ញុំតាមរយៈ Telegram</p>
                <div style="text-align: center;">
                    <a href="https://t.me/irra_11" class="button">ទាក់ទងមកកាន់យើងខ្ញុំ</a>
                </div>
            </div>
            <div class="footer">
                © 2026 <strong>Irra Store</strong> - រក្សាសិទ្ធិគ្រប់យ៉ាង<br>
                This is an automated message, please do not reply.
            </div>
        </div>
    </body>
    </html>
    """

    try:
        msg = EmailMessage()
        msg['Subject'] = email_subject
        msg['From'] = ADMIN_GMAIL
        msg['To'] = recipient
        
        # កំណត់ Plain Text សម្រាប់ Fallback
        msg.set_content(message_content)
        
        # បន្ថែមផ្នែក HTML (Gmail នឹងបង្ហាញ UI នេះ)
        msg.add_alternative(html_body, subtype='html')

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(ADMIN_GMAIL, GMAIL_APP_PASSWORD)
            smtp.send_message(msg)
        
        status = 'Completed' if is_success else 'Failed'
        with sqlite3.connect('orders.db') as conn:
            conn.execute("UPDATE orders SET status = ? WHERE id = ?", (status, order_id))
            conn.commit()
            
        return jsonify({"status": "sent"})
    except Exception as e:
        print(f"Email Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    init_db()
    print("Backend កំពុងដំណើរការលើ http://127.0.0.1:5001")
    app.run(port=5001, debug=True)