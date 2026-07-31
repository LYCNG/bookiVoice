import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 定義哪些路徑是公開的 (不需要登入即可存取)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/upload(.*)',
  '/books/new', // 允許存取新增頁面進行測試，或者您可以依需求改為保護
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // 略過 Next.js 內部檔案與靜態資源
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 始終運行於 API 路由
    '/(api|trpc)(.*)',
  ],
};
