import antfu from '@antfu/eslint-config';
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  antfu(
    {
      typescript: true,
      vue: true,
      // 根据 antfu 文档配置 stylistic 规则
      stylistic: {
        'semi': true, // 启用分号
        'quotes': 'single', // 单引号
        'linebreak-style': 'unix',
        'max-len': 120,
      },
      rules: {
        'no-console': 0,
        'no-explicit-any': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'ts/no-explicit-any': 'off', // antfu 配置中的 TypeScript 规则前缀
        'no-unused-vars': [
          'warn',
          { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
        ],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
        ],
      },
      ignores: [
        'app/assets/**/*',
        '.nuxt/**/*',
        '*.md',
      ],
    },
    {
      files: ['*.ts', '*.tsx', '*.jsx', '*.tsx', '*.vue'],
      rules: {
        'no-console': 0,
        // 允许显式的 any 类型
        '@typescript-eslint/no-explicit-any': 'off',
        'ts/no-explicit-any': 'off', // antfu 配置中的 TypeScript 规则前缀
        // 仅针对局部变量未使用报错
        'no-unused-vars': [
          'warn',
          { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
        ],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
        ],
        'unused-imports/no-unused-vars': 'off',

        // 完全关闭所有未使用表达式相关规则，允许短路表达式
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        'ts/no-unused-expressions': 'off',
        'unused-imports/no-unused-expressions': 'off',

        // 确保分号规则正确应用
        'style/semi': ['error', 'always'],
        'style/member-delimiter-style': [
          'error',
          {
            multiline: { delimiter: 'semi', requireLast: true },
            singleline: { delimiter: 'semi', requireLast: false },
          },
        ],
      },
      ignores: [
        'app/assets/**/*',
        '.nuxt/**/*',
        '*.md',
      ],
    },
    // Nitro 服务器端特定配置
    {
      files: ['server/**/*', './*.ts', './*.js', './*.mjs', './*.cjs'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'ts/no-explicit-any': 'off',
        // 在服务器端允许使用 process
        'node/prefer-global/process': 'off',
        'node/no-process-env': 'off',
      },
    },
    // 全局禁用 any 类型检查的配置
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'ts/no-explicit-any': 'off',
        'no-explicit-any': 'off',
      },
      ignores: [
        'app/assets/**/*',
        '.nuxt/**/*',
        '*.md',
      ],
    },
  ),
);
