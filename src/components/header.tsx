import Navigation from './navigation';

export default function Header() {
  return (
    <header className="flex gap-2 items-center">
      <p
        className="text-[#000]  
  font-[Bricolage_Grotesque] 
  text-[48px] 
  not-italic 
  font-semibold 
  leading-[125%] 
  upe"
      >
        We Make Delivers Not Promises
      </p>
      <Navigation />
    </header>
  );
}
