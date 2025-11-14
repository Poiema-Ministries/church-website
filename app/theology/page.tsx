// Copyright 2025 Poiema Ministries. All Rights Reserved.

type TheologyCreed = string;

const CREEDS: TheologyCreed[] = [
  'The Holy Scriptures of the Old and New Testaments are the Word of God, the only inerrant, perfect rule of faith and deed.',
  'There is only one God, and man shall worship only Him alone. God is the spirit, self-existent, and omnipresent, distinguishing Himself from all other gods and the created. God is infinite, eternal and unchangeable in His being, wisdom, power, holiness, justice, goodness, and love.',
  'There is Three Persons in the Godhead: the Father, the Son, and the Holy-Spirit; He is the triune God, one in trinity, equal in power and glory.',
  'God created all things visible and invisible by the power of His Word, and preserves and governs them, but God in His nature causes no sin. He acts all things by His plan according to His own will and governs all things to fulfill His purpose that is good, wise and holy.',
  'God created man, after His own image in knowledge, righteousness and holiness with dominion over every living thing. All men of the world are of a sole source. They are the same native and brother.',
  "Our first parents, being left to the freedom to choose between good and evil through temptation, transgressed the commandment of God. All mankind, the descending from Adam by ordinary generation sinned in him and fell with him in his transgression. The man, having possibility to commit a crime except the original sin and corrupted nature of mankind has intentionally committed sin; so as we are justly liable to God's just displeasure and punishment in this world and that which is to come.",
  'God sent His eternal, only begotten Son, Jesus Christ to the world to save man from sin, the corruption and the punishment thereof, to give eternal life in His infinite love. In Jesus Christ, God became flesh and through Him can man be saved. The eternal Son became true man and possessed two distinctive persons in His nature, eternally as true God and true man, in two distinct natures, and one person forever. He being conceived by the power of the Holy Spirit in the womb of the Virgin Mary, of her substance, born of her, yet without sin. He obeyed perfect sacrifice and satisfied divine justice. For the purpose of reconciliation between God and man. He was crucified on the cross, died and buried. He is sitting at the right hand of God making intercession for His people. From there He shall come for the resurrection of the dead, and to judge the world.',
  "The Holy Spirit being out of God the Father and God the Son, works salvation in man, convicts man of his sin and misery, enlightens man's heart to know Christ, renews man's will, exhorts him, empowers him to accept Jesus Christ who offers man the Gospel in grace freely, also works in us to bear the fruit of God's righteousness.",
  'Before God created the world, He elected in His love His own people to make them holy and blameless, predestined and adapted His children through Jesus Christ according to His pleasure and will, to the praise of the glory of His grace bestowed freely in the ones He loves. However, the perfect salvation offered freely so ordered to all mankind that they may repent their sins, believe in the Lord Jesus Christ as their Savior, rest upon Him and follow Him, obey the revealed will of God, be humble and conduct themselves in holiness, to the extent that whoever believes in Christ and is obedient into Him shall be saved. The particular benefits that are accompanied with justification: adoption as God’s children, sanctification and glorification are for the believers who are assured with God’s salvation and joy in this world. The means of grace, the calls of office by the Holy Spirit are: the Bible, sacraments and prayer in particular.',
  'The sacraments instituted by Christ are baptism and holy communion; baptism of washing with water is to be administered in the name of God the Father, the Son and the Holy Spirit, it’s the sign and seal of joining in union with Christ, and the promise for our regeneration and renewal by the Holy Spirit and God’s possession of us. Baptism shall be administered to those who make confession of faith in Christ, and to their children; Holy communion as partaking of the bread and the cup shall be served in remembrance of Christ’s death, and in the witness of the seal for the benefit derived from Christ’s death with which the believers are in union. Holy communion shall be observed by God’s people until the day of the Lord’s coming, and is a sign of a promise of more faithful service into the Lord and a sign of communion with the Lord and His people, who believe  in Him, and rest upon His atonement from which God’s benefit flows to us. The benefits of the sacraments are not found in the sacraments themselves or any virtue of him by whom the sacraments are being administered, but only in the blessing by Christ and the working of the Holy Spirit in those who by faith receive the sacraments.',
  'All believers shall dutifully join in church membership with instruction, have fellowship with one another among the believers, observe the sacraments and other ordinances, obey all the laws of the Lord, pray always, observe the Lord’s Day holy, assemble with believers to worship the Lord and listen attentively to the preaching of the Word of God, render offerings as God provides us abundantly, share with one another the mind of Christ, share also the same mind with all other people, endeavor to promote the expansion of the Kingdom of Christ upon the whole world, and wait expectantly for the appearance of the Lord in His glory.',
  'The dead shall receive the reward according to the good and evils done in this world before the judgment seat of Christ when they will be resurrected in the last day. Those who believe in Christ, and are obedient into Him shall be truly forgiven and accepted by Him in glory.',
];

export default function Theology() {
  return (
    <div className='flex flex-col min-h-screen w-full gap-4 sm:gap-5 md:gap-7'>
      <div className='flex flex-col items-start w-full max-w-xl'>
        <h1 className='text-4xl font-bold text-center mt-10 ml-5'>Theology</h1>
      </div>
      <div className='flex flex-col items-start w-full px-4 sm:px-6 md:px-8'>
        <span className='font-bold w-full break-words'>
          We belong to the World Korean Presbyterian Church denomination and
          adhere to the Westminster Confession of Faith and its 12 creeds, which
          are as follows:
        </span>
      </div>
      <div className='flex flex-col items-start w-full px-4 sm:px-6 md:px-8'>
        <ol
          type='1'
          className='font-normal w-full list-decimal list-outside pl-6 sm:pl-8 md:pl-10 break-words'
        >
          {CREEDS.map((creed: TheologyCreed, index: number) => (
            <li className='mb-2 break-words' key={index}>
              {creed}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
