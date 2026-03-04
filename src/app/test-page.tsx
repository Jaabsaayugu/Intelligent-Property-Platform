import { useAuthStore } from "@/store/auth.store";

export default function Test() {
  return <div>Test import: {typeof useAuthStore}</div>;
}