import { Button } from "@/components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";

export default function Clickus() {
  return (
    <>
      <Button variant='primary' size='icon'>click me please </Button>
      <Input placeholder='type here ...' className='w-[300px]' />
      <Badge>active</Badge>

    </>
  );
}
