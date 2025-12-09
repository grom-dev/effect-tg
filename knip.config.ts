import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/index.ts!'],
  project: ['src/**/*.ts!'],
  rules: {
    files: 'error',
    dependencies: 'error',
    devDependencies: 'error',
    optionalPeerDependencies: 'error',
    unlisted: 'error',
    binaries: 'error',
    catalog: 'error',
    unresolved: 'error',
    exports: 'error',
    nsExports: 'error',
    classMembers: 'error',
    enumMembers: 'error',
    types: 'error',
    nsTypes: 'error',
    duplicates: 'error',
  },
  eslint: {
    config: 'eslint.config.ts',
  },
  typescript: {
    config: [
      'tsconfig.dev.json',
      'tsconfig.lib.json',
    ],
  },
}

export default config
