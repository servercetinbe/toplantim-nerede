import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const localeCookie = cookies().get("NEXT_LOCALE");
  const locale = localeCookie ? localeCookie.value : "en"; // Varsayılan dil 'en'

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
