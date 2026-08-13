import { Problem } from '@/types';

export const PROBLEM_LIBRARY: Problem[] = [
  {
    id: 'two-sum-sorted',
    title: 'Two Sum with Sorted Array',
    difficulty: 'Easy',
    category: 'Arrays & Strings',
    timeLimitMinutes: 25,
    description: `Given a 1-indexed array of integers \`numbers\` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific \`target\` number. Return the 1-based indices of the two numbers as an integer array \`[index1, index2]\`.

You must write an algorithm with $O(N)$ or $O(\\log N)$ time complexity and $O(1)$ extra space.`,
    examples: [
      { input: 'numbers = [2, 7, 11, 15], target = 9', output: '[1, 2]', explanation: '2 + 7 = 9. 1-based indices are 1 and 2.' },
      { input: 'numbers = [2, 3, 4], target = 6', output: '[1, 3]', explanation: '2 + 4 = 6. 1-based indices are 1 and 3.' },
    ],
    constraints: [
      '2 <= numbers.length <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order',
      'Exactly one solution exists.',
    ],
    starterCode: {
      python: `def twoSum(numbers: list[int], target: int) -> list[int]:\n    # Write your O(N) two-pointer solution here\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        current_sum = numbers[left] + numbers[right]\n        if current_sum == target:\n            return [left + 1, right + 1]\n        elif current_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return []`,
      javascript: `function twoSum(numbers, target) {\n  let left = 0;\n  let right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) return [left + 1, right + 1];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}`,
      typescript: `function twoSum(numbers: number[], target: number): number[] {\n  let left = 0;\n  let right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) return [left + 1, right + 1];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& numbers, int target) {\n        int left = 0, right = numbers.size() - 1;\n        while (left < right) {\n            int sum = numbers[left] + numbers[right];\n            if (sum == target) return {left + 1, right + 1};\n            if (sum < target) left++;\n            else right--;\n        }\n        return {};\n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        int left = 0;\n        int right = numbers.length - 1;\n        while (left < right) {\n            int sum = numbers[left] + numbers[right];\n            if (sum == target) return new int[]{left + 1, right + 1};\n            if (sum < target) left++;\n            else right--;\n        }\n        return new int[]{};\n    }\n}`,
    },
    testCases: [
      { id: 't1', input: 'numbers = [2,7,11,15], target = 9', expectedOutput: '[1, 2]' },
      { id: 't2', input: 'numbers = [2,3,4], target = 6', expectedOutput: '[1, 3]' },
      { id: 't3', input: 'numbers = [-1,0], target = -1', expectedOutput: '[1, 2]' },
      { id: 't4', input: 'numbers = [1,2,3,4,4,9], target = 8', expectedOutput: '[4, 5]', isSecret: true },
      { id: 't5', input: 'numbers = [-5,-3,1,4,7,10], target = 4', expectedOutput: '[2, 5]', isSecret: true },
    ],
  },
  {
    id: 'lru-cache',
    title: 'Design LRU Cache (Least Recently Used)',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    timeLimitMinutes: 35,
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\` Return the value of the key if key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of key if key exists. Otherwise, add the key-value pair to cache. If keys exceed capacity, evict the least recently used key.

Must run \`get\` and \`put\` in $O(1)$ average time complexity.`,
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    starterCode: {
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = {}\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        val = self.cache.pop(key)\n        self.cache[key] = val\n        return val\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.pop(key)\n        elif len(self.cache) >= self.capacity:\n            oldest = next(iter(self.cache))\n            del self.cache[oldest]\n        self.cache[key] = value`,
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    else if (this.map.size >= this.capacity) {\n      const firstKey = this.map.keys().next().value;\n      this.map.delete(firstKey);\n    }\n    this.map.set(key, value);\n  }\n}`,
      typescript: `class LRUCache {\n  private capacity: number;\n  private map: Map<number, number>;\n  constructor(capacity: number) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key: number): number {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key)!;\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key: number, value: number): void {\n    if (this.map.has(key)) this.map.delete(key);\n    else if (this.map.size >= this.capacity) {\n      const firstKey = this.map.keys().next().value!;\n      this.map.delete(firstKey);\n    }\n    this.map.set(key, value);\n  }\n}`,
      cpp: `#include <unordered_map>\n#include <list>\nusing namespace std;\n\nclass LRUCache {\n    int cap;\n    list<pair<int, int>> cache;\n    unordered_map<int, list<pair<int, int>>::iterator> map;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (map.find(key) == map.end()) return -1;\n        cache.splice(cache.begin(), cache, map[key]);\n        return map[key]->second;\n    }\n    void put(int key, int value) {\n        if (map.find(key) != map.end()) {\n            map[key]->second = value;\n            cache.splice(cache.begin(), cache, map[key]);\n            return;\n        }\n        if (cache.size() == cap) {\n            map.erase(cache.back().first);\n            cache.pop_back();\n        }\n        cache.push_front({key, value});\n        map[key] = cache.begin();\n    }\n};`,
      java: `import java.util.*;\nclass LRUCache {\n    private final int capacity;\n    private final LinkedHashMap<Integer, Integer> map;\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        this.map = new LinkedHashMap<Integer, Integer>(capacity, 0.75f, true) {\n            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n                return size() > capacity;\n            }\n        };\n    }\n    public int get(int key) {\n        return map.getOrDefault(key, -1);\n    }\n    public void put(int key, int value) {\n        map.put(key, value);\n    }\n}`,
    },
    testCases: [
      { id: 'l1', input: 'LRUCache(2), put(1,1), put(2,2), get(1)', expectedOutput: '1' },
      { id: 'l2', input: 'put(3,3), get(2)', expectedOutput: '-1' },
      { id: 'l3', input: 'put(4,4), get(1)', expectedOutput: '-1' },
      { id: 'l4', input: 'get(3), get(4)', expectedOutput: '3, 4', isSecret: true },
      { id: 'l5', input: 'LRUCache(1), put(2,1), get(2), put(3,2), get(2)', expectedOutput: '1, -1', isSecret: true },
    ],
  },
  {
    id: 'lca-binary-tree',
    title: 'Lowest Common Ancestor of Binary Tree',
    difficulty: 'Medium',
    category: 'Graphs & Trees',
    timeLimitMinutes: 30,
    description: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes \`p\` and \`q\` in the tree.

The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (where we allow a node to be a descendant of itself).`,
    examples: [
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', output: '3' },
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', output: '5' },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [2, 10^5].',
      '-10^9 <= Node.val <= 10^9',
      'All Node.val are unique.',
      'p != q and p, q will exist in the tree.',
    ],
    starterCode: {
      python: `class TreeNode:\n    def __init__(self, x):\n        self.val = x\n        self.left = None\n        self.right = None\n\ndef lowestCommonAncestor(root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\n    if not root or root == p or root == q:\n        return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left and right:\n        return root\n    return left or right`,
      javascript: `function lowestCommonAncestor(root, p, q) {\n  if (!root || root === p || root === q) return root;\n  const left = lowestCommonAncestor(root.left, p, q);\n  const right = lowestCommonAncestor(root.right, p, q);\n  if (left && right) return root;\n  return left || right;\n}`,
      typescript: `function lowestCommonAncestor(root: any, p: any, q: any): any {\n  if (!root || root === p || root === q) return root;\n  const left = lowestCommonAncestor(root.left, p, q);\n  const right = lowestCommonAncestor(root.right, p, q);\n  if (left && right) return root;\n  return left || right;\n}`,
      cpp: `class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        if (!root || root == p || root == q) return root;\n        TreeNode* left = lowestCommonAncestor(root->left, p, q);\n        TreeNode* right = lowestCommonAncestor(root->right, p, q);\n        if (left && right) return root;\n        return left ? left : right;\n    }\n};`,
      java: `class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        if (root == null || root == p || root == q) return root;\n        TreeNode left = lowestCommonAncestor(root.left, p, q);\n        TreeNode right = lowestCommonAncestor(root.right, p, q);\n        if (left != null && right != null) return root;\n        return left != null ? left : right;\n    }\n}`,
    },
    testCases: [
      { id: 'b1', input: 'root = [3,5,1,6,2,0,8], p = 5, q = 1', expectedOutput: '3' },
      { id: 'b2', input: 'root = [3,5,1,6,2,0,8], p = 5, q = 4', expectedOutput: '5' },
      { id: 'b3', input: 'root = [1,2], p = 1, q = 2', expectedOutput: '1' },
      { id: 'b4', input: 'root = [6,2,8,0,4,7,9], p = 2, q = 8', expectedOutput: '6', isSecret: true },
      { id: 'b5', input: 'root = [6,2,8,0,4,7,9], p = 2, q = 4', expectedOutput: '2', isSecret: true },
    ],
  },
  {
    id: 'system-design-url-shortener',
    title: 'System Design: Distributed URL Shortener (TinyURL)',
    difficulty: 'Hard',
    category: 'System Design',
    timeLimitMinutes: 45,
    description: `Design a scalable, high-throughput distributed URL Shortener service like Bitly or TinyURL.

Key Requirements:
1. **Functional Requirements**:
   - Shorten a long URL to a unique 7-character alias (e.g., \`https://tiny.url/abc123X\`).
   - Redirection: Accessing the short link redirects to the original long URL with $< 50\\text{ms}$ latency.
   - Analytics: Track click counts and referrer metrics per link.
2. **Scale & Capacity**:
   - 100M new URLs created per day ($~1,150\\text{ writes/sec}$).
   - 10B redirects per day ($100:1$ read/write ratio, $~115,000\\text{ reads/sec}$).
3. **Availability & Resilience**:
   - $99.99\\%$ uptime, fault-tolerant DB, global CDN caching strategy.

Prepare to discuss Base62 encoding vs Key Generation Service (KGS), database schema, caching layer (Redis), and rate limiting.`,
    examples: [
      {
        input: 'High Read-to-Write Ratio (100:1), 10B redirects/day',
        output: 'Redis CDN caching layer + Distributed KGS pre-allocated tokens + Cassandra/NoSQL DB',
      },
    ],
    constraints: [
      'Must handle 115k read requests/sec at peak latency < 50ms.',
      'Must guarantee 0 collision rate across distributed microservices.',
      'Data retention: 5 years default expiration policy.',
    ],
    starterCode: {
      python: `# System Architecture Narrative & Component Breakdown:\n\nclass TinyURLService:\n    """\n    Architectural Design Proposal for Distributed TinyURL:\n    1. Base62 Hash Generator vs KGS (Key Generation Service)\n    2. Database Choice: Cassandra (High Write Scale) or PostgreSQL + Sharding\n    3. Caching Strategy: Redis Cluster LRU Eviction\n    4. Rate Limiting: Token Bucket Algorithm at API Gateway\n    """\n    def __init__(self):\n        pass`,
      javascript: `// System Design Architectural Proposal\nclass TinyURLService {\n  constructor() {\n    // Define DB Schema, Cache layer, and Key Generation strategy\n  }\n}`,
      typescript: `interface URLMapping {\n  shortCode: string;\n  longUrl: string;\n  createdAt: number;\n  expiresAt: number;\n  clickCount: number;\n}\n\nclass TinyURLService {\n  // Architecture Implementation & Strategy\n}`,
      cpp: `// C++ Distributed Service Architecture Outline\nclass TinyURLService {\npublic:\n    // Define API Gateway, Cache & Database Abstraction\n};`,
      java: `public class TinyURLService {\n    // Enterprise Scalable Architecture Design\n}`,
    },
    testCases: [
      { id: 'sys1', input: 'KGS vs Base62 Collision Analysis', expectedOutput: 'KGS avoids locks and collision retries' },
      { id: 'sys2', input: '115k Reads/Sec Caching Strategy', expectedOutput: '90% Cache Hit Rate via Redis LRU' },
      { id: 'sys3', input: 'DB Sharding Key Selection', expectedOutput: 'Shard by short_code hash for uniform distribution' },
      { id: 'sys4', input: 'Rate Limiter Algorithm', expectedOutput: 'Token Bucket per IP / API Key', isSecret: true },
      { id: 'sys5', input: 'Analytics Data Pipeline', expectedOutput: 'Kafka -> Spark -> ClickHouse OLAP', isSecret: true },
    ],
  },
];
