'use server';

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_ACCESS_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Try direct Telegram API first if credentials exist
  if (token && chatId) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (response.ok) {
        console.log('Telegram message sent directly via API');
        return;
      } else {
        const errorText = await response.text();
        console.error('Direct Telegram API failed:', errorText);
      }
    } catch (error) {
      console.error('Error sending direct Telegram message:', error);
    }
  }

  // Fallback to Flask API
  const apiUrl = process.env.FLASK_API_URL;
  if (apiUrl) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          parse_mode: 'HTML' // Include parse_mode for the fallback as well
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Telegram message sent via Flask:', data);
        return;
      }
    } catch (error) {
      console.error('Error sending Telegram message via Flask:', error);
    }
  }
}

const getBaseUrl = () => process.env.BETTER_AUTH_URL || 'http://localhost:3000';

export async function notifyPostCreated(username: string, content: string, postId: string) {
  const safeUsername = escapeHtml(username);
  const safeContent = escapeHtml(content.length > 200 ? content.substring(0, 197) + '...' : content);
  const viewUrl = `${getBaseUrl()}/post/${postId}`;
  
  const message = `📝 <b>New Post Created</b>\n\n<b>User:</b> <a href="${viewUrl}">${safeUsername}</a>\n<b>Content:</b>\n<i>${safeContent}</i>\n\n#newpost #nitean`;
  await sendTelegramNotification(message);
}

export async function notifyCommentCreated(username: string, content: string, articleSlug?: string) {
  const safeUsername = escapeHtml(username);
  const safeContent = escapeHtml(content.length > 200 ? content.substring(0, 197) + '...' : content);
  const articleInfo = articleSlug ? `\n<b>Article:</b> ${escapeHtml(articleSlug)}` : '';
  const viewUrl = articleSlug ? `${getBaseUrl()}/article/${articleSlug}` : getBaseUrl();
  
  const message = `💬 <b>New Comment</b>\n\n<b>User:</b> <a href="${viewUrl}">${safeUsername}</a>${articleInfo}\n<b>Comment:</b>\n<i>${safeContent}</i>\n\n#newcomment #nitean`;
  await sendTelegramNotification(message);
}

export async function notifyReplyCreated(username: string, content: string, postId: string, parentPostId?: string) {
  const safeUsername = escapeHtml(username);
  const safeContent = escapeHtml(content.length > 200 ? content.substring(0, 197) + '...' : content);
  const viewUrl = `${getBaseUrl()}/post/${parentPostId || postId}`;
  
  const message = `💬 <b>New Reply</b>\n\n<b>User:</b> <a href="${viewUrl}">${safeUsername}</a>\n<b>Reply:</b>\n<i>${safeContent}</i>\n\n#newreply #nitean`;
  await sendTelegramNotification(message);
}

export async function notifyArticleLiked(username: string, articleTitle: string, articleSlug: string) {
  const safeUsername = escapeHtml(username);
  const safeTitle = escapeHtml(articleTitle);
  const viewUrl = `${getBaseUrl()}/article/${articleSlug}`;
  
  const message = `❤️ <b>Article Liked</b>\n\n<b>User:</b> <a href="${viewUrl}">${safeUsername}</a>\n<b>Article:</b> ${safeTitle}\n\n#like #article #nitean`;
  await sendTelegramNotification(message);
}

export async function notifyPostLiked(username: string, postContent: string, postId: string) {
  const safeUsername = escapeHtml(username);
  const safeContent = escapeHtml(postContent.length > 50 ? postContent.substring(0, 47) + '...' : postContent);
  const viewUrl = `${getBaseUrl()}/post/${postId}`;
  
  const message = `❤️ <b>Post Liked</b>\n\n<b>User:</b> <a href="${viewUrl}">${safeUsername}</a>\n<b>Content:</b> <i>${safeContent}</i>\n\n#like #post #nitean`;
  await sendTelegramNotification(message);
}