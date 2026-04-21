-- Sample charities seed data
-- Run this after schema.sql to populate the charities table

INSERT INTO charities (name, description, image_url, is_featured) VALUES
(
  'Cancer Research UK',
  'The world''s leading cancer charity, funding life-saving research into all types of cancer. Every step of progress in cancer treatment has been made possible by supporters like you.',
  'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400',
  true
),
(
  'Alzheimer''s Society',
  'Leading the fight against dementia. We support people affected by dementia, campaign for better quality of life, and fund research to find a cure.',
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400',
  false
),
(
  'British Heart Foundation',
  'We fund groundbreaking research into heart and circulatory diseases, helping people live longer and healthier lives.',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
  false
),
(
  'MacMillan Cancer Support',
  'We provide medical, emotional, practical and financial support to people living with cancer, and their families.',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
  true
),
(
  'Save the Children',
  'We fight for children''s rights and deliver immediate and lasting change in their lives, in over 100 countries worldwide.',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
  false
),
(
  'Age UK',
  'We work to ensure older people are treated with respect and dignity, and that their voices are heard in government and society.',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b6f6e?w=400',
  false
) ON CONFLICT (name) DO NOTHING;
