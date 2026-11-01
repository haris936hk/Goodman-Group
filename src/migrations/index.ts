import * as migration_20261030_125037_initial_blog from './20261030_125037_initial_blog';

export const migrations = [
  {
    up: migration_20261030_125037_initial_blog.up,
    down: migration_20261030_125037_initial_blog.down,
    name: '20261030_125037_initial_blog'
  },
];
