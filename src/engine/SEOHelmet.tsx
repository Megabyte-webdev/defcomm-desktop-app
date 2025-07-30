import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEOHelmet: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
}) => {
  useEffect(() => {
    WebviewWindow.getCurrent().setTitle(`DefComm | ${title}`);
    console.log(title);
  }, [title]);

  return (
    <Helmet>
      <title>DefComm | {title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
    </Helmet>
  );
};

export default SEOHelmet;
