const useDecode = () => {
  const decodeHTMLEntities = (str: string) => {
    if (!str) return;

    str = str.replaceAll("&nbsp;", " ");
    str = str.replaceAll("&amp;", "&");
    str = str.replaceAll("&#33;", "!");
    str = str.replaceAll("&#34;", '"');
    str = str.replaceAll("&#35;", "#");
    str = str.replaceAll("&#36;", "$");
    str = str.replaceAll("&#37;", "%");
    str = str.replaceAll("&#38;", "&");
    str = str.replaceAll("&#39;", "'");
    str = str.replaceAll("&#40;", "(");
    str = str.replaceAll("&#41;", ")");
    str = str.replaceAll("&#42;", "*");
    str = str.replaceAll("&#43;", "+");
    str = str.replaceAll("&#44;", ",");
    str = str.replaceAll("&#45;", "-");
    str = str.replaceAll("&#46;", ".");
    str = str.replaceAll("&#47;", "/");
    str = str.replaceAll("&#58;", ":");
    str = str.replaceAll("&#59;", ";");
    str = str.replaceAll("&#60;", "<");
    str = str.replaceAll("&lt;", "<");
    str = str.replaceAll("&#61;", "=");
    str = str.replaceAll("&#62;", ">");
    str = str.replaceAll("&gt;", ">");
    str = str.replaceAll("&#63;", "?");
    str = str.replaceAll("&#64;", "@");
    return str;
  };

  return decodeHTMLEntities;
};

export default useDecode;
