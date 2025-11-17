const StatusCard = ({ title, icon: Icon, color, info }) => {
    const colorClasses = {
        green: "from-green-500 to-green-600",
        blue: "from-blue-500 to-blue-600",
        orange: "from-orange-400 to-orange-500",
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all`}>
            <h3 className="text-xl font-bold tracking-wide">{title}</h3>
            <Icon size={48} strokeWidth={2} />
            {info && <p className="text-base font-semibold">{info}</p>}
        </div>
    );
};

export default StatusCard;
