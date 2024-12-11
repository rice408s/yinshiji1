const axios = require('axios');

const ALIYUN_API = {
  endpoint: 'https://dashscope.aliyuncs.com/api/v1/apps',
  appId: '17adecaaf25041cabb3bf7564c5b7196',
  apiKey: 'sk-259a2ec00e1f4c52967676ad51fdbf45'
};

// 测试图片URL - 使用一个公开可访问的图片URL
const TEST_IMAGE_URL = 'https://example.com/test-food-image.jpg'; // 替换为实际的测试图片URL

async function testAnalyzeFood() {
  try {
    console.log('开始测试API调用...');
    console.log('请求URL:', `${ALIYUN_API.endpoint}/${ALIYUN_API.appId}/completion`);

    const response = await axios({
      method: 'POST',
      url: `${ALIYUN_API.endpoint}/${ALIYUN_API.appId}/completion`,
      headers: {
        'Authorization': `Bearer ${ALIYUN_API.apiKey}`,
        'Content-Type': 'application/json'
      },
      data: {
        input: {
          prompt: '分析图中的食物',
          biz_params: {
            image_url: TEST_IMAGE_URL
          }
        },
        parameters: {}
      }
    });

    console.log('API调用成功！');
    console.log('响应状态:', response.status);
    console.log('响应头:', response.headers);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('API调用失败！');
    console.error('错误状态码:', error.response?.status);
    console.error('错误信息:', error.response?.data || error.message);
    console.error('请求配置:', JSON.stringify(error.config, null, 2));

    if (error.response) {
      console.error('完整的错误响应:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// 运行测试
testAnalyzeFood();
