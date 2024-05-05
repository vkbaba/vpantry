/** @type {import('next').NextConfig} */
import { resolve } from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';
import Path from 'path';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/:year/:month/:slug',
                destination: '/posts/:slug/',
                permanent: true,
            },
        ];
    },

    output: 'export',
    basePath: isProd ? '' : '',
    assetPrefix: isProd ? `/` : '',
    images: {
        loader: "custom",
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      },
      transpilePackages: ["next-image-export-optimizer"],
      env: {
        nextImageExportOptimizer_imageFolderPath: "public",
        nextImageExportOptimizer_exportFolderPath: "out",
        nextImageExportOptimizer_quality: "75",
        nextImageExportOptimizer_storePicturesInWEBP: "true",
        nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
    
        // If you do not want to use blurry placeholder images, then you can set
        // nextImageExportOptimizer_generateAndUseBlurImages to false and pass
        // `placeholder="empty"` to all <ExportedImage> components.
        nextImageExportOptimizer_generateAndUseBlurImages: "true",
    
        // If you want to cache the remote images, you can set the time to live of the cache in seconds.
        // The default value is 0 seconds.
        nextImageExportOptimizer_remoteImageCacheTTL: "0",
      },
    webpack: (config, context) => {
        config.plugins.push(
          // Copy images from posts folder to public folder when building the site
            new CopyPlugin({
              patterns: [
                {
                    context: 'posts',
                    from: '**/images/*.{jpg,png,jpeg,gif,svg}',
                    to({ context, absoluteFilename }) {
                        const relativePath = absoluteFilename.replace(context, '');
                        const [year, title, ...rest] = relativePath.split(Path.sep).filter(Boolean);
                        return resolve(`./public/${title}/${rest.join('/')}`);
                    },
                },
              ],
            }),
          new WriteFilePlugin()
        );
        return config;
    },
}


export default nextConfig;
